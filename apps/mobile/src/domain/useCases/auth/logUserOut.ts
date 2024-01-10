import { firebaseProvider } from '@common/providers/firebase'
import { setLoggedUser } from '@helpers/authentication/setLoggedUser'

export async function logUserOutUseCase() {
    await firebaseProvider.getAuth().signOut()

    return setLoggedUser(null)
}
