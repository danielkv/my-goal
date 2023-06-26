import { firebaseProvider } from '@common/providers/firebase'
import { extractUserCredential, setLoggedUser } from '@contexts/user/userContext'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { createAppException } from '@utils/exceptions/AppException'

type EmailCredentials = { provider: 'email'; email: string; password: string }

type Credentials = EmailCredentials

export async function logUserInUseCase(credentials: Credentials) {
    const credentialResult = await _loginRouter(credentials)
    if (!credentialResult) throw new Error('Nenhum usuário foi logado')

    if (!credentialResult.user.email)
        throw createAppException('USER_WITH_NO_EMAIL', 'Email não cadastrado', credentialResult.user)

    if (!credentialResult.user.emailVerified) {
        await credentialResult.user.sendEmailVerification()
        throw createAppException('EMAIL_NOT_VERIFIED', 'Email não verificado')
    }

    setLoggedUser(extractUserCredential(credentialResult.user))
}

async function _loginRouter(credentials: Credentials): Promise<FirebaseAuthTypes.UserCredential | null> {
    if (credentials.provider === 'email') return _emailLogin(credentials)

    return null
}

async function _emailLogin(credentials: EmailCredentials) {
    const user = await firebaseProvider.getAuth().signInWithEmailAndPassword(credentials.email, credentials.password)

    return user
}
