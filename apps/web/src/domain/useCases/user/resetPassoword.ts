import { supabase } from '@common/providers/supabase'

export async function resetPasswordUseCase(password: string, token: string) {
    const { data, error: getUserError } = await supabase.auth.getSession()
    if (getUserError) throw getUserError

    if (!data.session) {
        const { error: tokenError } = await supabase.auth.verifyOtp({ token_hash: token, type: 'recovery' })
        if (tokenError) throw new Error('Ouve um erro ao validar seu token de segurança')
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
}
