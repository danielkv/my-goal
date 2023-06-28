import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import * as AppleAuthentication from 'expo-apple-authentication'
import * as Crypto from 'expo-crypto'

import { firebaseProvider } from '@common/providers/firebase'
import LoginButton from '@components/LoginButton'
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { getErrorMessage } from '@utils/getErrorMessage'

export default function AppleLogin() {
    const [available, setAvailable] = useState(false)
    const navigation = useNavigation()

    useEffect(() => {
        AppleAuthentication.isAvailableAsync().then(setAvailable)
    }, [])

    const handleLogin = async () => {
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
            .then(async ({ identityToken }) => {
                const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce)

                await firebaseProvider.getAuth().signInWithCredential(appleCredential)

                navigation.navigate(ERouteName.HomeScreen)
            })
            .catch((error) => {
                Alert.alert(getErrorMessage(error))
            })
    }

    if (!available) return null

    return <LoginButton mode="apple" onPress={handleLogin} />
}
