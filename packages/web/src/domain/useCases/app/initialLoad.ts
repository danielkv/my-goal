import { firebaseProvider } from '@common/providers/firebase'
import { setLoggedUser } from '@contexts/user/user.context'
import { extractUserCredential } from '@utils/users'

export function initialLoadUseCase() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const loggedUser = firebaseProvider.getAuth().currentUser

            if (loggedUser) setLoggedUser(extractUserCredential(loggedUser))

            resolve(true)
        }, 1000)
    })
}
