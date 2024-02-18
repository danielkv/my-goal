import { supabase } from '@common/providers/supabase'
import { setLoggedUser } from '@contexts/user/user.context'

export async function logUserOut() {
    setLoggedUser(null)
    await supabase.auth.signOut()
}
