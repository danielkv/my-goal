import { supabase } from '@common/providers/supabase'
import { setLoggedUser } from '@contexts/user/user.context'
import { extractUserCredential } from '@utils/users'

export async function logUserInUseCase(email: string, password: string) {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    console.log(JSON.stringify(data.user, null, 2))

    if (data.user.app_metadata.claims_admin !== true) {
        await supabase.auth.signOut()
        throw new Error('Você não tem permissão para acessar essa página')
    }

    setLoggedUser(extractUserCredential(data.user))
}
