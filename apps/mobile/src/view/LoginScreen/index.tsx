import { Image, ImageBackground } from 'react-native'

import * as Linking from 'expo-linking'
import { H3, ScrollView, Separator, Stack, Text, XStack, YStack, getTokens } from 'tamagui'

import LoginBg from '@assets/images/login-bg.png'
import LogoGoal from '@assets/images/logo-goal.png'
import Button from '@components/Button'
import LoginButton from '@components/LoginButton'
import SafeAreaView from '@components/SafeAreaView'
import { StackActions, useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'

import AppleLogin from './components/AppleLogin'
import GoogleLogin from './components/GoogleLogin'

const termsOfUseUrl = 'https://mygoal.app/termos-de-uso'
const privacyPolicyUrl = 'https://mygoal.app/politica-de-privacidade'

const LoginScreen: React.FC = () => {
    const navigation = useNavigation()

    const { size } = getTokens()

    const handleSuccessSocialLogin = () => {
        navigation.dispatch(StackActions.replace(ERouteName.HomeScreen))
    }

    return (
        <SafeAreaView flex={1}>
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
                            <Text textAlign="center">Escolha como deseja continuar</Text>
                        </Stack>

                        <YStack gap="$3">
                            <LoginButton
                                mode="email"
                                onPress={() => navigation.navigate(ERouteName.EmailLoginScreen)}
                            />
                            <AppleLogin onSuccess={handleSuccessSocialLogin} />

                            <GoogleLogin onSuccess={handleSuccessSocialLogin} />

                            <Separator borderColor="$gray5" width={100} alignSelf="center" />

                            <Button
                                variant="primary"
                                fontWeight="700"
                                onPress={() => navigation.navigate(ERouteName.SubscriptionScreen)}
                            >
                                Criar uma nova conta
                            </Button>
                        </YStack>
                        <XStack>
                            <Button
                                f={0.45}
                                fontWeight="400"
                                variant="link"
                                onPress={() => Linking.openURL(termsOfUseUrl)}
                            >
                                Termos de uso
                            </Button>

                            <Button
                                f={0.55}
                                fontWeight="400"
                                variant="link"
                                onPress={() => Linking.openURL(privacyPolicyUrl)}
                            >
                                Política de Privacidade
                            </Button>
                        </XStack>
                    </YStack>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default LoginScreen
