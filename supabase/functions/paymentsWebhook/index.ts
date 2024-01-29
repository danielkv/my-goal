import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTION') return new Response('ok', { headers: corsHeaders })

    const { event } = await req.json()
    const purchaseObject = event?.data?.object
    if (!purchaseObject) throw new Error('No data found')

    if (event.type !== 'checkout.session.completed') throw new Error('WRONG event type')

    const userId = purchaseObject.customer_details.email
    const token = purchaseObject.subscription

    const REVENUECAT_STRIPE_KEY = Deno.env.get('STRIPE_KEY_REVENUECAT')
    if (!REVENUECAT_STRIPE_KEY) throw new Error('No REVENUECAT_STRIPE_KEY found')

    await fetch('https://api.revenuecat.com/v1/receipts', {
        body: JSON.stringify({
            app_user_id: userId,
            fetch_token: token,
            attributes: { stripe_customer_id: { value: purchaseObject.customer } },
        }),
        headers: { 'X-Platform': 'stripe', Authorization: `Bearer ${REVENUECAT_STRIPE_KEY}` },
    })

    return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } })
})
