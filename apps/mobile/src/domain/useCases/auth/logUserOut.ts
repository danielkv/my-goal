import { supabase } from '@common/providers/supabase'
import { setLoggedUser } from '@helpers/authentication/setLoggedUser'

export async function logUserOutUseCase() {
    await supabase.auth.signOut()

    return setLoggedUser(null)
}
