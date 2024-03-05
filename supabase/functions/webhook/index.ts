import { createSupabaseSuperClient } from '../_shared/client.ts'
import { createStripe } from '../_shared/stripe.ts'
import { processProgramPayment } from './processProgramPayment.ts'
import { processWorksheetPayment } from './processWorksheetPayment.ts'
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

app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const stripe = createStripe()
        const endpointSecret = 'whsec_9a800a001cf17e194ae01f07f9aff7babaafcd7440177b2098dfee0f495c5df7' //Deno.env.get('STRIPE_WEBHOOK_SIGNATURE') || ''
        const sig = req.header('stripe-signature')
        if (!sig) throw new Error('Stripe signature is empty')

        const event = await stripe.webhooks.constructEventAsync(req.body, sig, endpointSecret)

        if (!['customer.subscription.created', 'checkout.session.completed'].includes(event.type))
            throw new Error('WRONG event type')

        const purchaseObject = event.data.object as Stripe.Checkout.Session
        if (!purchaseObject.customer_details) throw new Error('No data found')

        await processProductsObject(purchaseObject)

        res.json({ received: true })
    } catch (err) {
        res.status(400).send(err.message)
    }
})

app.listen(port, () => {
    console.log('listening on port:', port)
})

async function processProductsObject(session: Stripe.Checkout.Session) {
    const stripe = createStripe()

    const { line_items } = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
    })

    const items = line_items?.data
    if (!items?.length) throw new Error('No product in the list')

    const supabase = createSupabaseSuperClient()

    // deno-lint-ignore no-explicit-any
    let user: Record<string, any>
    const userEmail = session.customer_details?.email
    if (!userEmail) throw new Error('Invalid user email')

    const { error, data: retrievedUser } = await supabase
        .from('users')
        .select()
        .eq('email', session.customer_details?.email)
        .maybeSingle()
    if (error) throw error

    if (!retrievedUser) {
        const { error, data: newUser } = await supabase.auth.admin.createUser({
            email: userEmail,
            phone: session.customer_details?.phone || undefined,
            user_metadata: { displayName: session.customer_details?.name },
        })
        if (error) throw error
        user = newUser
    } else user = retrievedUser

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
                        await processProgramPayment(supabase, user.id, item, product)
                        break
                    }
                    case 'worksheet': {
                        const token = session.subscription
                        if (!token || !session.customer) return reject('Data is incomplete')
                        await processWorksheetPayment(supabase, user.email, token as string, session.customer as string)
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
