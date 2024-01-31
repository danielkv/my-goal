import { supabase } from '@common/providers/supabase'

export type SocialLoginProvider = 'google'

export async function socialLoginUseCase(provider: 'google') {
    const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: 'http://localhost:3001/dashboard/login',
        },
    })

    if (error) throw error
}
