import { SupabaseClient } from 'https://esm.sh/v133/@supabase/supabase-js@2.38.4/dist/module/index.js'

export async function processWorksheetPayment(
    supabase: SupabaseClient,
    userId: string,
    token: string,
    customer_id: string
) {
    const REVENUECAT_STRIPE_KEY = Deno.env.get('STRIPE_KEY_REVENUECAT')
    if (!REVENUECAT_STRIPE_KEY) throw new Error('No REVENUECAT_STRIPE_KEY found')

    await fetch('https://api.revenuecat.com/v1/receipts', {
        body: JSON.stringify({
            app_user_id: userId,
            fetch_token: token,
            attributes: { stripe_customer_id: { value: customer_id } },
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
}
