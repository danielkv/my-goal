import { Image, ImageBackground } from 'react-native'

import { H3, ScrollView, Stack, Text, YStack, getTokens } from 'tamagui'

import LoginBg from '@assets/images/login-bg.png'
import LogoGoal from '@assets/images/logo-goal.png'
import LoginButton from '@components/LoginButton'
import SafeAreaView from '@components/SafeAreaView'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'

import AppleLogin from './components/AppleLogin'
import GoogleLogin from './components/GoogleLogin'

const LoginScreen: React.FC = () => {
    const navigation = useNavigation()

    const { size } = getTokens()

    const handleSuccessSocialLogin = (credential: FirebaseAuthTypes.UserCredential) => {
        if (credential.user.displayName && credential.user.phoneNumber) navigation.navigate(ERouteName.HomeScreen)
        else navigation.navigate(ERouteName.SubscriptionScreen, { redirect: ERouteName.HomeScreen })
    }

    return (
        <SafeAreaView>
            <ImageBackground style={{ flex: 1 }} source={LoginBg}>
                <ScrollView
                    flex={1}
                    contentContainerStyle={{ padding: size[3].val }}
                    keyboardShouldPersistTaps="handled"
                >
                    <YStack gap="$3">
                        <Stack mt="$8" mb="$5">
                            <Image source={LogoGoal} style={{ width: '100%', height: 60, resizeMode: 'contain' }} />
                        </Stack>

                        <Stack mb="$3">
                            <H3 textAlign="center" fontWeight="900">
                                Bem vindo
                            </H3>
                            <Text textAlign="center">Escolha seu provedor de login</Text>
                        </Stack>

                        <YStack gap="$3">
                            <LoginButton
                                mode="email"
                                onPress={() => navigation.navigate(ERouteName.EmailLoginScreen)}
                            />
                            <AppleLogin onSuccess={handleSuccessSocialLogin} />
                            <GoogleLogin onSuccess={handleSuccessSocialLogin} />
                        </YStack>
                    </YStack>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default LoginScreen
