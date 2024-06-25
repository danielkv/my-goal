import { createAsaas } from '../_shared/asaas/index.ts'
import { ChargeEvent, EventName } from '../_shared/asaas/webhook-events.ts'
import { createSupabaseSuperClient } from '../_shared/client.ts'
import { handleErrorMiddleware } from '../_shared/errors.ts'
import { createStripe } from '../_shared/stripe.ts'
import { processProgramPayment } from './processProgramPayment.ts'
import { processWorksheetPayment } from './processWorksheetPayment.ts'
import { AdminUserAttributes, User } from 'https://esm.sh/v133/@supabase/supabase-js@2.38.4/dist/module/index.js'
// @deno-types="npm:@types/cors@2.8.5"
import cors from 'npm:cors@2.8.5'
// @deno-types="npm:@types/express@4.17.15"
import express from 'npm:express@4.18.2'
import Stripe from 'npm:stripe@^14.17.0'

const port = 3000
const app = express()

//app.use(express.json())
app.use(
    cors({
        preflightContinue: true,
    })
)

app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res, next) => {
    try {
        const stripe = createStripe()
        const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNATURE') || ''
        const sig = req.header('stripe-signature')
        if (!sig) throw new Error('Stripe signature is empty')

        const event = await stripe.webhooks.constructEventAsync(req.body, sig, endpointSecret)

        if (!['customer.subscription.created', 'checkout.session.completed'].includes(event.type))
            throw new Error('WRONG event type')

        const purchaseObject = event.data.object as Stripe.Checkout.Session
        if (!purchaseObject.customer_details) throw new Error('No data found')

        const userEmail = purchaseObject.customer_details?.email
        if (!userEmail) throw new Error('Invalid user email')

        const user = await retrieveUser(userEmail, purchaseObject.customer_details?.phone || undefined, {
            displayName: purchaseObject.customer_details?.name,
        })
        await processStripeProductsObject(user, purchaseObject)

        res.json({ received: true })
    } catch (err) {
        next(err)
    }
})

app.post('/webhook/asaas', express.json(), async (req, res, next) => {
    try {
        const webhookToken = Deno.env.get('ASAAS_WEBHOOK_ACCESS_TOKEN')!
        const asaasAcessToken = req.header('asaas-access-token')

        if (webhookToken !== asaasAcessToken) throw new Error('Asaas access token invalid')

        const asaas = createAsaas()
        const body: ChargeEvent = req.body

        if (body.event !== EventName.PAYMENT_CONFIRMED) return res.status(404).send('Evento indisponível')

        const customer = await asaas.getCustomer(body.payment.customer)

        const user = await retrieveUser(customer.email, customer.phone, {
            displayName: customer.name,
        })

        if (!body.payment.paymentLink) throw new Error('Payment Link does not exist')

        let paid_amount = body.payment.value
        // if (body.payment.installment) {
        //     const asaas = createAsaas()
        //     const installment = await asaas.getInstallment(body.payment.installment)
        //     paid_amount = installment.value
        // }

        await processAsaasProduct(user, body.payment.paymentLink, paid_amount)

        res.json({ received: true })
    } catch (err) {
        next(err)
    }
})

app.use(handleErrorMiddleware)

app.listen(port, () => {
    console.log('listening on port:', port)
})

async function retrieveUser(
    email: string,
    phone: string | undefined,
    metadata: AdminUserAttributes['user_metadata']
): Promise<User> {
    const supabase = createSupabaseSuperClient()

    const { error: getError, data: retrievedUser } = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .maybeSingle()
    if (getError) throw getError

    if (retrievedUser) return retrievedUser

    const { error, data: newUser } = await supabase.auth.admin.createUser({
        email,
        phone,
        user_metadata: metadata,
    })
    if (error) throw error

    if (!newUser.user) throw new Error('User not created')

    return newUser.user
}

async function processAsaasProduct(user: User, paymentLinkId: string, paid_amount: number) {
    const supabase = createSupabaseSuperClient()

    const { error, data: program } = await supabase
        .from('programs')
        .select('*')
        .eq('payment_link_id', paymentLinkId)
        .maybeSingle()
    if (error) throw error

    console.log('program', program.id)

    if (!program) throw new Error('Program does not exist')

    await processProgramPayment(supabase, user.id, paid_amount, 'asaas', program.id, program.expiration)
}

async function processStripeProductsObject(user: User, session: Stripe.Checkout.Session) {
    const stripe = createStripe()

    const { line_items } = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
    })

    const items = line_items?.data
    if (!items?.length) throw new Error('No product in the list')

    const supabase = createSupabaseSuperClient()

    const promises = items.map(
        (item) =>
            // deno-lint-ignore no-async-promise-executor
            new Promise(async (resolve, reject) => {
                const productId = item.price?.product
                if (!productId || typeof productId !== 'string') return reject('Produto não está listado')
                const product = await stripe.products.retrieve(productId)

                if (!product?.metadata?.category) return reject('Product category is empty')

                switch (product.metadata.category) {
                    case 'program': {
                        const programId = product.metadata.programId
                        if (!programId) throw Error('ProductId does not exist')

                        const { error, data: program } = await supabase
                            .from('programs')
                            .select('*')
                            .eq('id', programId)
                            .maybeSingle()
                        if (error) throw error

                        await processProgramPayment(
                            supabase,
                            user.id,
                            item.amount_total / 100,
                            'stripe',
                            programId,
                            program.expiration
                        )
                        break
                    }
                    case 'worksheet': {
                        const token = session.subscription
                        if (!token || !session.customer) return reject('Data is incomplete')
                        await processWorksheetPayment(
                            supabase,
                            user.email || '',
                            token as string,
                            session.customer as string
                        )
                        break
                    }
                    default:
                        return reject('This Category cannot be handled')
                }

                return resolve(true)
            })
    )

    await Promise.all(promises)
}
