import { SocialLoginProvider } from 'goal-models'

import { supabase } from '@common/providers/supabase'
import { extractSupabaseUserCredential } from '@contexts/user/userContext'
import { setLoggedUser } from '@helpers/authentication/setLoggedUser'

export async function socialLoginUseCase(provider: SocialLoginProvider, token: string, nonce?: string): Promise<void> {
    const { error, data } = await supabase.auth.signInWithIdToken({ provider, token, nonce })
    if (error) throw error

    return setLoggedUser(extractSupabaseUserCredential(data.user))
}
