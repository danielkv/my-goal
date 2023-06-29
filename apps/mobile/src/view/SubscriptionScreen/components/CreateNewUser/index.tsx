import { Alert, Image } from 'react-native'

import { Formik, FormikConfig } from 'formik'
import parsePhoneNumberFromString from 'libphonenumber-js/min'
import { H3, Stack } from 'tamagui'

import LogoGoal from '@assets/images/logo-goal.png'
import Button from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { createUserUseCase } from '@useCases/auth/createUser'
import { logMessageUseCase } from '@useCases/log/logMessage'
import { createAppException } from '@utils/exceptions/AppException'
import { getErrorMessage } from '@utils/getErrorMessage'
import { TSubscriptionForm, initialValues, validationSchema } from '@view/SubscriptionScreen/config'

import SubscriptionForm from '../SubscriptionForm'

const CreateNewUser: React.FC = () => {
    const navigation = useNavigation()

    const onSubmit: FormikConfig<TSubscriptionForm>['onSubmit'] = async (result) => {
        try {
            await createUserUseCase({
                displayName: result.name,
                phoneNumber: parsePhoneNumberFromString(result.phoneNumber, 'BR')?.number || '',
                email: result.email,
                password: result.password,
            })

            Alert.alert(
                'Sua conta criada com sucesso',
                'Verifique sua caixa de entrada ou lixo eletrônico para verificar seu email.',
                [{ style: 'default', onPress: () => navigation.navigate(ERouteName.LoginScreen) }]
            )
        } catch (err) {
            const logError = createAppException('ERROR_CAUGHT', err)
            logMessageUseCase(logError.toObject())
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        }
    }

    return (
        <Stack gap="$3">
            <Stack mt="$5" mb="$3">
                <Image source={LogoGoal} style={{ width: '100%', height: 60, resizeMode: 'contain' }} />
            </Stack>

            <Stack mb="$3">
                <H3 fontWeight="900" textAlign="center">
                    Faça seu cadastro
                </H3>
            </Stack>

            <Formik onSubmit={onSubmit} validationSchema={validationSchema} initialValues={initialValues()}>
                {({ handleSubmit, isSubmitting }) => (
                    <>
                        <SubscriptionForm />
                        <Button loading={isSubmitting} variant="primary" onPress={() => handleSubmit()}>
                            Cadastrar
                        </Button>

                        <Button onPress={() => navigation.navigate(ERouteName.LoginScreen)}>Login</Button>
                    </>
                )}
            </Formik>
        </Stack>
    )
}

export default CreateNewUser
