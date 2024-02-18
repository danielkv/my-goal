import React, { useState } from 'react'
import { Alert } from 'react-native'

import Constants from 'expo-constants'

import LoginButton from '@components/LoginButton'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { socialLoginUseCase } from '@useCases/auth/socialLogin'
import { AuthException } from '@utils/exceptions/AuthException'
import { getErrorMessage } from '@utils/getErrorMessage'

GoogleSignin.configure({
    webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
})

interface GoogleLoginProps {
    onSuccess?(): void
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setLoading(true)

            await GoogleSignin.hasPlayServices()

            const { idToken } = await GoogleSignin.signIn()

            if (!idToken) throw new Error('idToken and/or authCode are null')

            await socialLoginUseCase('google', idToken)

            onSuccess?.()
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
