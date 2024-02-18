import { supabase } from '@common/providers/supabase'

export function sendResetPasswordEmailUseCase(email: string) {
    return supabase.auth.resetPasswordForEmail(email)
}
