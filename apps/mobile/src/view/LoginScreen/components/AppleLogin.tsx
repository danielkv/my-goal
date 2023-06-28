import * as AppleAuthentication from 'expo-apple-authentication'
import * as Crypto from 'expo-crypto'
import { Stack } from 'tamagui'

import { firebaseProvider } from '@common/providers/firebase'
import auth from '@react-native-firebase/auth'

export default function AppleLogin() {
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
            .then(({ identityToken }) => {
                const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce)

                return firebaseProvider.getAuth().signInWithCredential(appleCredential)
            })
            .catch((error) => {
                // ...
            })
    }
    return (
        <Stack>
            <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={5}
                onPress={handleLogin}
            />
        </Stack>
    )
}
