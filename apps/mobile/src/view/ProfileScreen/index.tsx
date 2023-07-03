import { useState } from 'react'
import { Alert } from 'react-native'

import Constants from 'expo-constants'
import { getContrastColor, stringToColor, userInitials } from 'goal-utils'
import parsePhoneNumberFromString from 'libphonenumber-js/min'
import { Avatar, Stack, Text, YStack } from 'tamagui'

import Button from '@components/Button'
import { setLoggedUser, useLoggedUser } from '@contexts/user/userContext'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { Edit, LogOut } from '@tamagui/lucide-icons'
import { logUserOutUseCase } from '@useCases/auth/logUserOut'
import { removeUserUseCase } from '@useCases/auth/removeUser'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const ProfileScreen: React.FC = () => {
    const { navigate, reset } = useNavigation()
    const user = useLoggedUser()

    const [loading, setLoading] = useState(false)

    usePreventAccess()

    const handlePressRemoveAccount = () => {
        Alert.alert('Confirmação', 'Tem certeza que deseja excluir sua conta?', [
            { text: 'Sim', onPress: handleConfirmRemoveAccount },
            { text: 'Não', isPreferred: true },
        ])
    }

    const handleConfirmRemoveAccount = async () => {
        try {
            setLoading(true)
            await removeUserUseCase()

            Alert.alert(
                'Conta excluída',
                'Seus dados de acesso foram excluídos. O processo de remoção de seus dados pode levar até 30 dias.'
            )

            setLoggedUser(null)
        } catch (err) {
            Alert.alert('Ocorreu um erro', getErrorMessage(err), [
                { text: 'Tentar novamente', onPress: handleConfirmRemoveAccount },
                { text: 'Cancelar', isPreferred: true },
            ])
        } finally {
            setLoading(false)
        }
    }

    const handlePressLogout = () => {
        Alert.alert('Confirmação', 'Tem certeza que deseja sair?', [
            {
                text: 'Sim',
                onPress: async () => {
                    logUserOutUseCase()
                    reset({ routes: [{ name: ERouteName.HomeScreen }, { name: ERouteName.LoginScreen }] })
                },
            },
            { text: 'Não', isPreferred: true },
        ])
    }

    if (!user) return null

    const avatarColor = user.displayName ? stringToColor(user.displayName) : ''
    const textAvatarColor = getContrastColor(avatarColor)

    return (
        <Stack f={1}>
            <YStack f={1} alignItems="stretch" p="$6" gap="$4">
                <YStack alignItems="center" gap="$3">
                    <Avatar bg={avatarColor} circular size="$10">
                        {user.photoURL && <Avatar.Image source={{ uri: user.photoURL }} />}
                        <Avatar.Fallback bg={avatarColor} ai="center" jc="center">
                            <Text fontSize="$10" fontWeight="800" color={textAvatarColor}>
                                {userInitials(user.displayName)}
                            </Text>
                        </Avatar.Fallback>
                    </Avatar>
                    <Text fontWeight="bold" fontSize={18}>
                        {user.displayName}
                    </Text>
                    <Text fontSize={16}>{user.email}</Text>
                    {user.phoneNumber && (
                        <Text fontSize={14}>
                            {parsePhoneNumberFromString(user.phoneNumber, 'BR')?.formatNational()}
                        </Text>
                    )}
                </YStack>
                <Button icon={<Edit size={20} color="white" />} onPress={() => navigate(ERouteName.SubscriptionScreen)}>
                    Alterar informações
                </Button>
                <Button icon={<LogOut size={20} color="white" />} onPress={handlePressLogout}>
                    Logout
                </Button>
                <Button loading={loading} variant="link" onPress={handlePressRemoveAccount}>
                    <Text color="white">Excluir conta</Text>
                </Button>
            </YStack>
            {!!Constants.expoConfig?.version && (
                <Text ta="center" mb="$3" fontSize="$3" color="$gray5">
                    v{Constants.expoConfig?.version}
                </Text>
            )}
        </Stack>
    )
}

export default ProfileScreen
