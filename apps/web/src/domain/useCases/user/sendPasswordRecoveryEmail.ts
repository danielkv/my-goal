import { supabase } from '@common/providers/supabase'

export async function sendPasswordRecoveryEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
}
