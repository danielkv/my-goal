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
        const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNATURE') || ''
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
        console.log(err.message)
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

    const { error, data: user } = await supabase
        .from('users')
        .select()
        .eq('email', session.customer_details?.email)
        .single()
    if (error) throw error

    const promises = items.map(
        (item) =>
            // deno-lint-ignore no-async-promise-executor
            new Promise(async (resolve) => {
                const productId = item.price?.product
                if (!productId || typeof productId !== 'string') throw new Error('Produto não está listado')
                const product = await stripe.products.retrieve(productId)

                switch (product.metadata.category) {
                    case 'program': {
                        await processProgramPayment(supabase, user.id, item, product)
                        break
                    }
                    case 'worksheet': {
                        const token = session.subscription
                        if (!token || !session.customer) throw new Error('Data is incomplete')
                        await processWorksheetPayment(supabase, user.email, token as string, session.customer as string)
                        break
                    }
                }

                return resolve(true)
            })
    )

    await Promise.all(promises)
}
