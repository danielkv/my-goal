import { SupabaseClient } from 'https://esm.sh/v133/@supabase/supabase-js@2.38.4/dist/module/index.js'
import Stripe from 'npm:stripe@^14.17.0'

export async function processProgramPayment(
    supabase: SupabaseClient,
    userId: string,
    lineItem: Stripe.LineItem,
    product: Stripe.Product
) {
    const programId = product.metadata.programId
    if (!programId) throw Error('ProductId does not exist')

    const { error: programError, data } = await supabase.from('programs').select().eq('id', programId).single()
    if (programError) throw programError

    const expires_at = new Date()
    expires_at.setDate(expires_at.getDate() + data.expiration)

    const { error: createProgramPaymentError } = await supabase.from('user_programs').insert({
        program_id: programId,
        paid_amount: lineItem.amount_total / 100,
        method: 'stripe',
        user_id: userId,
        expires_at: expires_at.toISOString(),
    })
    if (createProgramPaymentError) throw createProgramPaymentError
}
