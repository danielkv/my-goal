import { useRef, useState } from 'react'
import { Alert, Image, ImageBackground } from 'react-native'

import { FormikConfig, useFormik } from 'formik'
import { H3, ScrollView, Stack, Text, YStack, getTokens } from 'tamagui'

import LoginBg from '@assets/images/login-bg.png'
import LogoGoal from '@assets/images/logo-goal.png'
import ActivityIndicator from '@components/ActivityIndicator'
import Button from '@components/Button'
import SafeAreaView from '@components/SafeAreaView'
import TextField from '@components/TextField'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { Eye, EyeOff, User } from '@tamagui/lucide-icons'
import { logUserInUseCase } from '@useCases/auth/logUserIn'
import { sendResetPasswordEmailUseCase } from '@useCases/auth/sendResetPasswordEmail'
import { isAppException } from '@utils/exceptions/AppException'
import { getErrorMessage } from '@utils/getErrorMessage'

import { TLoginForm, initialValues, validationSchema } from './config'

const EmailLoginScreen: React.FC = () => {
    const [hidePassword, setHidePassword] = useState(true)
    const navigation = useNavigation()
    const [loadingResetPassword, setLoadingResetPassword] = useState(false)
    const { size } = getTokens()

    const inputRefs = useRef<Record<string, any>>({})

    const onSubmit: FormikConfig<TLoginForm>['onSubmit'] = async (result) => {
        try {
            await logUserInUseCase({ provider: 'email', ...result })

            navigation.navigate(ERouteName.HomeScreen)
        } catch (err) {
            if (isAppException(err) && err.type === 'EMAIL_NOT_VERIFIED') {
                return Alert.alert(
                    'Seu email não foi verificado',
                    'Verifique sua caixa de entrada ou lixo eletrônico para verificar seu email',
                    [
                        {
                            text: 'OK',
                            style: 'default',
                            isPreferred: true,
                        },
                    ]
                )
            }
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        }
    }

    const { handleSubmit, handleChange, values, errors, isSubmitting, validateField } = useFormik({
        onSubmit,
        validationSchema,
        initialValues: initialValues(),
    })

    const handleResetPassword = async () => {
        try {
            setLoadingResetPassword(true)
            await validateField('email')
            if (errors.email) return

            await sendResetPasswordEmailUseCase(values.email)

            Alert.alert(
                'Instruções enviadas para seu email',
                'Enviamos um email para você resetar sua senha. Caso não encontre o email na caixa de entrada, verifique no lixo eletrônico.'
            )
        } catch (err) {
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        } finally {
            setLoadingResetPassword(false)
        }
    }

    return (
        <SafeAreaView>
            <ImageBackground style={{ flex: 1 }} source={LoginBg}>
                <ScrollView
                    flex={1}
                    contentContainerStyle={{ padding: size[3].val }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Stack mt="$8" mb="$5">
                        <Image source={LogoGoal} style={{ width: '100%', height: 60, resizeMode: 'contain' }} />
                    </Stack>

                    <Stack mb="$3">
                        <H3 textAlign="center" fontWeight="900">
                            Bem vindo
                        </H3>
                        <Text textAlign="center">Faça seu login</Text>
                    </Stack>

                    <YStack gap="$3" ai="center">
                        <TextField
                            label="Email"
                            autoFocus
                            componentLeft={<User size={22} color="$gray5" />}
                            keyboardType="email-address"
                            textContentType="username"
                            onChangeText={handleChange('email')}
                            value={values.email}
                            error={errors.email}
                            autoCapitalize="none"
                            returnKeyType="next"
                            ref={(ref: any) => (inputRefs.current['email'] = ref)}
                            autoCorrect
                            onSubmitEditing={() => {
                                inputRefs.current['password']?.focus()
                            }}
                        />
                        <TextField
                            ref={(ref) => {
                                inputRefs.current['password'] = ref
                            }}
                            label="Senha"
                            onChangeText={handleChange('password')}
                            value={values.password}
                            error={errors.password}
                            returnKeyType="join"
                            textContentType="password"
                            secureTextEntry={hidePassword}
                            componentRight={
                                <Button
                                    variant="transparent"
                                    size="$3"
                                    circular
                                    onPress={() => setHidePassword(!hidePassword)}
                                    icon={
                                        hidePassword ? (
                                            <Eye size={22} color="$gray5" />
                                        ) : (
                                            <EyeOff size={22} color="$gray5" />
                                        )
                                    }
                                />
                            }
                            onSubmitEditing={() => handleSubmit()}
                        />

                        <Button variant="primary" loading={isSubmitting} onPress={() => handleSubmit()}>
                            Login
                        </Button>
                        <Button
                            disabled={isSubmitting}
                            onPress={() => navigation.navigate(ERouteName.SubscriptionScreen)}
                        >
                            Novo cadastro
                        </Button>
                        {loadingResetPassword ? (
                            <ActivityIndicator />
                        ) : (
                            <Button variant="link" onPress={handleResetPassword}>
                                Esqueci a senha
                            </Button>
                        )}
                    </YStack>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default EmailLoginScreen
