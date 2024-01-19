import { firebaseProvider } from '@common/providers/firebase'
import { supabase } from '@common/providers/supabase'
import { setLoggedUser } from '@helpers/authentication/setLoggedUser'

export async function logUserOutUseCase() {
    await firebaseProvider.getAuth().signOut()
    await supabase.auth.signOut()

    return setLoggedUser(null)
}
