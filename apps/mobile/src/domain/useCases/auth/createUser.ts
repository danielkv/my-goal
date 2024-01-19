import { firebaseProvider } from '@common/providers/firebase'
import { extractUserCredential } from '@contexts/user/userContext'
import { IUserFB, IUserInput } from '@models/user'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

const updateUserFn = firebaseProvider.FUNCTION_CALL<
    { uid: string; data: Partial<FirebaseAuthTypes.UserInfo> },
    IUserFB
>('updateUser')

export async function createUserUseCase(userInput: IUserInput): Promise<IUserFB> {
    const auth = firebaseProvider.getAuth()
    const { user } = await auth.createUserWithEmailAndPassword(userInput.email, userInput.password)

    await user.sendEmailVerification()

    await updateUserFn({
        uid: user.uid,
        data: { displayName: userInput.displayName, phoneNumber: userInput.phoneNumber },
    })

    await user.reload()

    await auth.signOut()

    return extractUserCredential(user)
}
