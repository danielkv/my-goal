import { SocialLoginProvider } from 'goal-models'

import { supabase } from '@common/providers/supabase'
import { extractSupabaseUserCredential } from '@contexts/user/userContext'
import { setLoggedUser } from '@helpers/authentication/setLoggedUser'

const fbBaseUrl = process.env.EXPO_PUBLIC_FB_FUNCTIONS_BASE_URL

export async function socialLoginUseCase(provider: SocialLoginProvider, token: string, nonce?: string): Promise<void> {
    const { error, data } = await supabase.auth.signInWithIdToken({ provider, token, nonce })
    if (error) throw error

    // migrate data from firebase
    if (!data.user.user_metadata.fbuid) {
        const url = `${fbBaseUrl}/getUserByEmail?email=${data.user.email}`
        const fbUser = await fetch(url, { method: 'GET' }).then(async (res) => {
            if (!res.ok) return null

            return res.json()
        })

        if (fbUser) {
            supabase.auth.updateUser({
                phone: fbUser.phoneNumber,
                data: { displayName: fbUser.displayName, photoUrl: fbUser.photoURL, fbuid: fbUser.uid },
            })
        }
    }

    return setLoggedUser(extractSupabaseUserCredential(data.user))
}
