import { SocialLoginProvider } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function socialLoginUseCase(provider: SocialLoginProvider) {
    const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: 'http://localhost:3001/dashboard/login',
        },
    })

    if (error) throw error
}
