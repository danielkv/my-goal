import React, { useState } from 'react'
import { Alert } from 'react-native'

import Constants from 'expo-constants'

import { firebaseProvider } from '@common/providers/firebase'
import LoginButton from '@components/LoginButton'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { AuthException } from '@utils/exceptions/AuthException'
import { getErrorMessage } from '@utils/getErrorMessage'

GoogleSignin.configure({
    webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
})

interface GoogleLoginProps {
    onSuccess?(credential: FirebaseAuthTypes.UserCredential): void
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setLoading(true)

            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

            const { idToken } = await GoogleSignin.signIn()

            const googleCredential = auth.GoogleAuthProvider.credential(idToken)

            const credential = await firebaseProvider.getAuth().signInWithCredential(googleCredential)

            onSuccess?.(credential)
        } catch (error: any) {
            const exception = new AuthException(error)
            if (exception.code === statusCodes.SIGN_IN_CANCELLED) return

            Alert.alert('Ocorreu um erro', getErrorMessage(exception))
        } finally {
            setLoading(false)
        }
    }

    return <LoginButton loading={loading} mode="google" onPress={handleLogin} />
}

export default GoogleLogin
