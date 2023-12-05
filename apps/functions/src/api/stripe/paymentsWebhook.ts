import { init } from '../../helpers'
import axios from 'axios'
import { remoteConfig } from 'firebase-admin'
import { ExplicitParameterValue } from 'firebase-admin/lib/remote-config/remote-config-api'
import { https } from 'firebase-functions'

init()

export const paymentsWebhook = https.onRequest(async (request, response) => {
    const event = request.body
    const purchaseObject = event?.data?.object

    if (!purchaseObject) throw new Error('No data found')

    if (event.type !== 'checkout.session.completed') throw new Error('WRONG event type')

    const userId = purchaseObject.customer_details.email
    const token = purchaseObject.subscription

    const template = await remoteConfig().getTemplate()
    const REVENUECAT_STRIPE_KEY = template.parameters.REVENUECAT_STRIPE_KEY.defaultValue as
        | ExplicitParameterValue
        | undefined

    if (!REVENUECAT_STRIPE_KEY?.value) throw new Error('No REVENUECAT_STRIPE_KEY found')

    await axios.post(
        '/receipts',
        {
            app_user_id: userId,
            fetch_token: token,
            attributes: { stripe_customer_id: { value: purchaseObject.customer } },
        },
        {
            baseURL: 'https://api.revenuecat.com/v1',
            headers: { 'X-Platform': 'stripe', Authorization: `Bearer ${REVENUECAT_STRIPE_KEY.value}` },
        }
    )

    response.json({ received: true })
})
