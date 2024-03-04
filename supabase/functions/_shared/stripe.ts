import Stripe from 'npm:stripe@^14.17.0'

export function createStripe() {
    const apiKey = Deno.env.get('STRIPE_API_KEY') || ''
    return new Stripe(apiKey)
}
