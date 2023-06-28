import { Stack } from 'tamagui'

import { firebaseProvider } from '@common/providers/firebase'
import auth from '@react-native-firebase/auth'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'

GoogleSignin.configure()

export default function AppleLogin() {
    const handleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices()
            await GoogleSignin.signIn()
            const { accessToken, idToken } = await GoogleSignin.getTokens()

            const appleCredential = auth.AppleAuthProvider.credential(idToken, accessToken)

            return firebaseProvider.getAuth().signInWithCredential(appleCredential)
        } catch (error) {
            //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // 	// user cancelled the login flow
            //   } else if (error.code === statusCodes.IN_PROGRESS) {
            // 	// operation (e.g. sign in) is in progress already
            //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // 	// play services not available or outdated
            //   } else {
            // 	// some other error happened
            //   }
        }
    }
    return (
        <Stack>
            <GoogleSigninButton onPress={handleLogin} />
        </Stack>
    )
}
