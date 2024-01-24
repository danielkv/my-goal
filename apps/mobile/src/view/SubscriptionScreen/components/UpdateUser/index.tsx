import { useEffect, useState } from 'react'
import { Alert, Image } from 'react-native'

import { Formik, FormikConfig } from 'formik'
import { isUserDataComplete } from 'goal-utils'
import parsePhoneNumberFromString from 'libphonenumber-js/min'
import { H3, Stack } from 'tamagui'

import LogoGoal from '@assets/images/logo-goal.png'
import Button from '@components/Button'
import { useLoggedUser } from '@contexts/user/userContext'
import { RouteProp, StackActions, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName, TReactNavigationStackParamList } from '@router/types'
import { updateUserUseCase } from '@useCases/auth/updateUser'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'
import { TSubscriptionForm, validationSchema } from '@view/SubscriptionScreen/config'

import SubscriptionForm from '../SubscriptionForm'

const UpdateUser: React.FC = () => {
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()
    const user = useLoggedUser()
    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'SubscriptionScreen'>>()

    const incompleteData = isUserDataComplete(user)

    usePreventAccess()

    useEffect(() => {
        navigation.setOptions({ title: 'Alterar informações' })
    }, [])

    useEffect(() => {
        if (!incompleteData) return
        Alert.alert(
            'Complete seu cadastro',
            'Para continuar, verifique seu cadastro e preencha as informações que estão faltando'
        )
    }, [])

    const handleConfirmOnSubmit: FormikConfig<TSubscriptionForm>['onSubmit'] = async (result, helper) => {
        setLoading(true)

        if (result.email !== user?.email) {
            Alert.alert(
                'Confirme para continuar',
                'Ao alterar seu email, você precisará confirma-lo para poder logar novamente. Deseja continuar?',
                [
                    { text: 'Sim', onPress: () => handleSubmit(result) },
                    {
                        text: 'Não',
                        isPreferred: true,
                        onPress: () => {
                            setLoading(false)
                            helper.setFieldValue('email', user?.email)
                        },
                    },
                ]
            )
            return
        }

        handleSubmit(result)
    }

    const handleSubmit = async (result: TSubscriptionForm) => {
        try {
            await updateUserUseCase({
                displayName: result.name,
                phone: parsePhoneNumberFromString(result.phoneNumber, 'BR')?.number,
                email: result.email,
            })

            Alert.alert('Seus dados foram atualizados', 'Pressione OK para continuar.', [
                {
                    style: 'default',
                    onPress: () => {
                        if (params?.redirect)
                            navigation.dispatch(StackActions.replace(params.redirect, params.redirectParams))
                        else
                            navigation.reset({
                                routes: [{ name: ERouteName.HomeScreen }, { name: ERouteName.Profile }],
                            })
                    },
                },
            ])
        } catch (err) {
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <Stack gap="$3">
            <Stack mt="$5" mb="$3">
                <Image source={LogoGoal} style={{ width: '100%', height: 60, resizeMode: 'contain' }} />
            </Stack>

            <Stack mb="$3">
                <H3 fontWeight="900" textAlign="center">
                    Atualize seu cadastro
                </H3>
            </Stack>

            <Formik
                onSubmit={handleConfirmOnSubmit}
                validationSchema={validationSchema}
                initialValues={{
                    email: user.email || '',
                    name: user.displayName || '',
                    phoneNumber: parsePhoneNumberFromString(user.phone || '', 'BR')?.formatNational() || '',
                    password: '',
                    mode: 'update',
                }}
            >
                {({ handleSubmit, isSubmitting }) => (
                    <>
                        <SubscriptionForm />
                        <Button
                            spinnerColor="white"
                            loading={isSubmitting || loading}
                            variant="primary"
                            onPress={() => handleSubmit()}
                        >
                            Atualizar
                        </Button>
                    </>
                )}
            </Formik>
        </Stack>
    )
}

export default UpdateUser
