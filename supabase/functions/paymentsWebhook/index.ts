import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
    if (req.method !== 'POST') return new Response('INVALID METHOD', { status: 404, headers: corsHeaders })

    const event = await req.json()

    try {
        if (!['customer.subscription.created', 'checkout.session.completed'].includes(event.type))
            throw new Error('WRONG event type')

        const purchaseObject = event?.data?.object
        if (!purchaseObject) throw new Error('No data found')

        if (!['customer.subscription.created', 'checkout.session.completed'].includes(event.type))
            throw new Error('WRONG event type')

        const userId = purchaseObject.customer_details.email
        const token = purchaseObject.subscription

        if (!userId) return new Response('USER_ID IS EMPTY', { status: 500, headers: corsHeaders })

        const REVENUECAT_STRIPE_KEY = Deno.env.get('STRIPE_KEY_REVENUECAT')
        if (!REVENUECAT_STRIPE_KEY) throw new Error('No REVENUECAT_STRIPE_KEY found')

        await fetch('https://api.revenuecat.com/v1/receipts', {
            body: JSON.stringify({
                app_user_id: userId,
                fetch_token: token,
                attributes: { stripe_customer_id: { value: purchaseObject.customer } },
            }),
            method: 'POST',
            headers: {
                'X-Platform': 'stripe',
                Authorization: `Bearer ${REVENUECAT_STRIPE_KEY}`,
                'Content-Type': 'application/json',
            },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(`ERROR: ${JSON.stringify(await res.json())}`)
                return res.status
            })
            .then((res) => console.log('res', JSON.stringify(res, null, 2)))

        return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } })
    } catch (err) {
        return new Response(err.message, { status: 400, headers: corsHeaders })
    }
})
