import { SupabaseClient } from 'https://esm.sh/v133/@supabase/supabase-js@2.38.4/dist/module/index.js'

export async function processProgramPayment(
    supabase: SupabaseClient,
    userId: string,
    paid_amount: number,
    method: string,
    programId: string
) {
    const { error: programError, data: program } = await supabase.from('programs').select().eq('id', programId).single()
    if (programError) throw programError

    const expires_at = new Date()
    expires_at.setDate(expires_at.getDate() + program.expiration)

    const { error: createProgramPaymentError } = await supabase.from('user_programs').insert({
        program_id: programId,
        paid_amount,
        method,
        user_id: userId,
        expires_at: expires_at.toISOString(),
    })
    if (createProgramPaymentError) throw createProgramPaymentError
}
