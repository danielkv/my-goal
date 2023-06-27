import { useCallback, useState } from 'react'
import { Alert } from 'react-native'

import Constants from 'expo-constants'
import { getContrastColor, stringToColor, userInitials } from 'goal-utils'
import { Avatar, Stack, Text, YStack } from 'tamagui'

import Button from '@components/Button'
import { setLoggedUser, useLoggedUser } from '@contexts/user/userContext'
import { StackActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { LogOut } from '@tamagui/lucide-icons'
import { logUserOutUseCase } from '@useCases/auth/logUserOut'
import { removeUserUseCase } from '@useCases/auth/removeUser'
import { getErrorMessage } from '@utils/getErrorMessage'

const ProfileScreen: React.FC = () => {
    const { dispatch } = useNavigation()
    const user = useLoggedUser()

    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            if (!user) dispatch(StackActions.replace(ERouteName.LoginScreen))
        }, [user])
    )

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
            { text: 'Sim', onPress: logUserOutUseCase },
            { text: 'Não', isPreferred: true },
        ])
    }

    if (!user) return null

    const avatarColor = stringToColor(user.displayName)
    const textAvatarColor = getContrastColor(avatarColor)

    return (
        <Stack f={1}>
            <YStack f={1} alignItems="stretch" p="$6" gap="$4">
                <YStack alignItems="center" gap="$4">
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
                    {user.phoneNumber && <Text fontSize={14}>{user.phoneNumber}</Text>}
                </YStack>
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
