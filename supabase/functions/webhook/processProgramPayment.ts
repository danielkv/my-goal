import { SupabaseClient } from 'https://esm.sh/v133/@supabase/supabase-js@2.38.4/dist/module/index.js'

export async function processProgramPayment(
    supabase: SupabaseClient,
    userId: string,
    paid_amount: number,
    method: string,
    programId: string,
    expiration: number
) {
    const { error: userProgramError, data: userProgram } = await supabase
        .from('user_programs')
        .select('id')
        .eq('user_id', userId)
        .eq('program_id', programId)
        .gte('expires_at', new Date().toISOString())
    if (userProgramError) throw userProgramError
    console.log('userPrograms', userProgram.length)
    if (userProgram.length) return

    const expires_at = new Date()
    expires_at.setDate(expires_at.getDate() + expiration)

    const { error: createProgramPaymentError } = await supabase.from('user_programs').insert({
        program_id: programId,
        paid_amount,
        method,
        user_id: userId,
        expires_at: expires_at.toISOString(),
    })
    if (createProgramPaymentError) throw createProgramPaymentError
}
