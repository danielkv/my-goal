import { Alert } from 'react-native'

import Constants from 'expo-constants'

import { firebaseProvider } from '@common/providers/firebase'
import LoginButton from '@components/LoginButton'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { getErrorMessage } from '@utils/getErrorMessage'

GoogleSignin.configure({
    webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
})

export default function GoogleLogin() {
    const navigation = useNavigation()

    const handleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices()
            console.log('1')

            const { idToken } = await GoogleSignin.signIn()
            console.log('2')

            const appleCredential = auth.AppleAuthProvider.credential(idToken)
            console.log('3')

            await firebaseProvider.getAuth().signInWithCredential(appleCredential)

            navigation.navigate(ERouteName.HomeScreen)
        } catch (error) {
            Alert.alert(getErrorMessage(error))
        }
    }
    return <LoginButton mode="google" onPress={handleLogin} />
}
