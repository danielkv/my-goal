import { pick } from 'radash'

import { firebaseProvider } from '@common/providers/firebase'
import { extractUserCredential } from '@contexts/user/userContext'
import { IUser, IUserInput } from '@models/user'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

const updateUserFn = firebaseProvider.FUNCTION_CALL<{ uid: string; data: Partial<FirebaseAuthTypes.UserInfo> }, IUser>(
    'updateUser'
)

export async function updateUserUseCase(userInput: Partial<Omit<IUserInput, 'password'>>): Promise<IUser> {
    const user = firebaseProvider.getAuth().currentUser
    if (!user) throw new Error('Usuário não está logado')

    await updateUserFn({
        uid: user.uid,
        data: pick(userInput, ['displayName', 'email', 'phoneNumber']),
    })

    await user.reload()

    if (user.email !== userInput.email) {
        await user.sendEmailVerification()
    }

    return extractUserCredential(user)
}
