import { pick } from 'radash'

import { firebaseProvider } from '@common/providers/firebase'
import { supabase } from '@common/providers/supabase'
import { extractSupabaseUserCredential, extractUserCredential } from '@contexts/user/userContext'
import { setLoggedUser } from '@helpers/authentication/setLoggedUser'

type EmailCredentials = { provider: 'email'; email: string; password: string }

type Credentials = EmailCredentials

export async function logUserInUseCase(credentials: Credentials) {
    // try supabase login first
    const { error, data } = await supabase.auth.signInWithPassword(credentials)
    if (!error) return setLoggedUser(extractSupabaseUserCredential(data.user))

    if (error.name === 'AuthApiError' && error.message === 'Invalid login credentials') {
        const { user } = await firebaseProvider
            .getAuth()
            .signInWithEmailAndPassword(credentials.email, credentials.password)

        const { data, error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            phone: user.phoneNumber || undefined,

            options: {
                data: {
                    fbuid: user.uid,
                    ...pick(extractUserCredential(user), ['displayName', 'photoUrl']),
                    confirmation_sent_at: new Date().toISOString(),
                },
            },
        })

        if (error) throw error
        if (!data.user) throw new Error('User not found')

        return setLoggedUser(extractSupabaseUserCredential(data.user))
    }

    throw error
}
