import { useState } from 'react'
import { Alert, Dimensions, Image, ScrollView } from 'react-native'

import { getContrastColor, stringToColor, userInitials } from 'goal-utils'
import parsePhoneNumberFromString from 'libphonenumber-js/min'
import { Stack, Text, XStack, YStack } from 'tamagui'

import Button from '@components/Button'
import { setLoggedUser, useLoggedUser } from '@contexts/user/userContext'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { Dumbbell, Edit, LogOut, Medal } from '@tamagui/lucide-icons'
import { logUserOutUseCase } from '@useCases/auth/logUserOut'
import { removeUserUseCase } from '@useCases/auth/removeUser'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const IMAGE_HEIGHT = Dimensions.get('screen').height / 3

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

    const imagePlaceholder = '' //'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg'

    return (
        <ScrollView style={{ flex: 1 }}>
            <Stack ai="center" bg={avatarColor}>
                {imagePlaceholder ? (
                    <Image
                        source={{ uri: imagePlaceholder }}
                        style={{ width: '100%', height: IMAGE_HEIGHT }}
                        resizeMode="cover"
                    />
                ) : (
                    <Text marginVertical="$6" fontSize="$10" fontWeight="800" color={textAvatarColor}>
                        {userInitials(user.displayName)}
                    </Text>
                )}
            </Stack>
            <Stack gap="$6" p="$6">
                <YStack ai="center">
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
                <YStack f={1} alignItems="stretch" gap="$3.5" zIndex={-1}>
                    <XStack gap="$3.5">
                        <Button flexDirection="column" f={1} alignItems="flex-end" h="auto" gap="$4.5" p="$3.5">
                            <Dumbbell size={20} color="white" />
                            <Text fontWeight="700">PRs</Text>
                        </Button>
                        <Button flexDirection="column" f={1} alignItems="flex-end" h="auto" gap="$4.5" p="$3.5">
                            <Medal size={20} color="white" />
                            <Text fontWeight="700">Workouts</Text>
                        </Button>
                    </XStack>
                    <Button
                        icon={<Edit size={20} color="white" />}
                        onPress={() => navigate(ERouteName.SubscriptionScreen)}
                    >
                        Alterar informações
                    </Button>
                    <Button icon={<LogOut size={20} color="white" />} onPress={handlePressLogout}>
                        Logout
                    </Button>
                    <Button loading={loading} variant="link" onPress={handlePressRemoveAccount}>
                        <Text color="white">Excluir conta</Text>
                    </Button>
                </YStack>
            </Stack>
        </ScrollView>
    )
}
/* {!!Constants.expoConfig?.version && (
                <Text ta="center" mb="$3" fontSize="$3" color="$gray5">
                    v{Constants.expoConfig?.version}
                </Text>
            )}*/
export default ProfileScreen
