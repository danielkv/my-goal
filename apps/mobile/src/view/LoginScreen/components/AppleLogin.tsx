import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import * as AppleAuthentication from 'expo-apple-authentication'
import * as Crypto from 'expo-crypto'
import { displayArray } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import LoginButton from '@components/LoginButton'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { AuthException } from '@utils/exceptions/AuthException'
import { getErrorMessage } from '@utils/getErrorMessage'

interface AppleLoginProps {
    onSuccess?(credential: FirebaseAuthTypes.UserCredential): void
}

const AppleLogin: React.FC<AppleLoginProps> = ({ onSuccess }) => {
    const [available, setAvailable] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        AppleAuthentication.isAvailableAsync().then(setAvailable)
    }, [])

    const handleLogin = async () => {
        setLoading(true)

        const nonce = Math.random().toString(36).substring(2, 10)

        return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
            .then((hashedNonce) =>
                AppleAuthentication.signInAsync({
                    requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                    nonce: hashedNonce,
                })
            )
            .then(async ({ identityToken, fullName }) => {
                const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce)

                const credential = await firebaseProvider.getAuth().signInWithCredential(appleCredential)

                if (!credential.user.displayName && fullName?.givenName) {
                    await firebaseProvider.getAuth().currentUser?.updateProfile({
                        displayName: displayArray([fullName?.givenName, fullName.familyName]),
                    })
                    await firebaseProvider.getAuth().currentUser?.reload()
                }

                onSuccess?.(credential)
            })
            .catch((err: any) => {
                const exception = new AuthException(err)
                if (exception.code === 'ERR_REQUEST_CANCELED') return

                Alert.alert('Ocorreu um erro', getErrorMessage(exception))
            })
            .finally(() => setLoading(false))
    }

    if (!available) return null

    return <LoginButton loading={loading} mode="apple" onPress={handleLogin} />
}

export default AppleLogin
