import { useState } from 'react'
import { Alert, Dimensions, View } from 'react-native'
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { LinearGradient } from 'expo-linear-gradient'
import { getContrastColor, stringToColor, userInitials } from 'goal-utils'
import parsePhoneNumberFromString from 'libphonenumber-js/min'
import { Stack, Text, XStack, YStack, getTokens } from 'tamagui'

import Button from '@components/Button'
import { useLoggedUser } from '@contexts/user/userContext'
import { setLoggedUser } from '@helpers/authentication/setLoggedUser'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { ChevronLeft, Dumbbell, Edit, LogOut, Medal, UserCircle2 } from '@tamagui/lucide-icons'
import { logUserOutUseCase } from '@useCases/auth/logUserOut'
import { removeUserUseCase } from '@useCases/auth/removeUser'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const HEADER_MAX_HEIGHT = Dimensions.get('screen').height / 2.1
const HEADER_MIN_HEIGHT = Dimensions.get('screen').height / 4

const ProfileScreen: React.FC = () => {
    const { navigate, reset, goBack } = useNavigation()
    const user = useLoggedUser()
    const { space } = getTokens()

    const insets = useSafeAreaInsets()

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

            await setLoggedUser(null)
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

    const scrollY = useSharedValue(0)
    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y
    })

    const imageStyle = useAnimatedStyle(() => {
        const height = interpolate(
            scrollY.value,
            [0, HEADER_MIN_HEIGHT],
            [HEADER_MAX_HEIGHT, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            {
                extrapolateRight: Extrapolate.CLAMP,
            }
        )
        return {
            height,
        }
    })

    if (!user) return null

    const avatarColor = user.displayName ? stringToColor(user.displayName) : ''
    const textAvatarColor = getContrastColor(avatarColor)

    const profileImage = user.photoURL

    return (
        <Stack f={1}>
            <LinearGradient
                colors={['rgba(30,30,30,0.9)', 'transparent']}
                style={{
                    zIndex: 999,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    paddingTop: insets.top,
                    paddingBottom: space[6].val,
                }}
            >
                <Button
                    onPress={() => {
                        goBack()
                    }}
                    circular
                    transparent
                    icon={<ChevronLeft size={30} />}
                    pressStyle={{ bg: 'rgba(0,0,0,0.1)' }}
                />
            </LinearGradient>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: avatarColor, zIndex: -1 }}>
                {profileImage ? (
                    <Animated.Image
                        source={{ uri: profileImage }}
                        style={[{ width: '100%', height: HEADER_MAX_HEIGHT }, imageStyle]}
                        resizeMode="cover"
                    />
                ) : (
                    <Stack f={1} ai="center" jc="center" h={HEADER_MIN_HEIGHT}>
                        <Text marginVertical="$6" fontSize="$10" fontWeight="800" color={textAvatarColor}>
                            {userInitials(user.displayName)}
                        </Text>
                    </Stack>
                )}

                <LinearGradient
                    colors={['transparent', 'rgba(30,30,30,0.9)']}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: space['3.5'].val,
                        paddingTop: space[6].val,
                    }}
                >
                    <Text fontWeight="bold" fontSize={18}>
                        {user.displayName}
                    </Text>
                    <Text fontSize={16}>{user.email}</Text>
                    {user.phoneNumber && (
                        <Text fontSize={14}>
                            {parsePhoneNumberFromString(user.phoneNumber, 'BR')?.formatNational()}
                        </Text>
                    )}
                </LinearGradient>
            </View>
            <Animated.ScrollView style={{ flex: 1 }} onScroll={onScroll} scrollEventThrottle={16}>
                <Stack h={profileImage ? HEADER_MAX_HEIGHT : HEADER_MIN_HEIGHT} />
                <Stack gap="$6" p="$6" bg="$gray7">
                    <YStack f={1} alignItems="stretch" gap="$3.5">
                        <XStack gap="$3.5">
                            <Button
                                onPress={() => navigate(ERouteName.MovementList)}
                                flexDirection="column"
                                f={1}
                                alignItems="flex-end"
                                h="auto"
                                gap="$4.5"
                                p="$3.5"
                            >
                                <Dumbbell size={20} color="white" />
                                <Text fontWeight="700">PRs</Text>
                            </Button>
                            <Button
                                onPress={() => navigate(ERouteName.UserWorkoutList)}
                                flexDirection="column"
                                f={1}
                                alignItems="flex-end"
                                h="auto"
                                gap="$4.5"
                                p="$3.5"
                            >
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
                        <Button
                            icon={<UserCircle2 size={20} color="white" />}
                            onPress={() => navigate(ERouteName.SelectPlan)}
                        >
                            Assinatura
                        </Button>
                        <Button icon={<LogOut size={20} color="white" />} onPress={handlePressLogout}>
                            Logout
                        </Button>
                        <Button loading={loading} variant="link" onPress={handlePressRemoveAccount}>
                            <Text color="white">Excluir conta</Text>
                        </Button>
                    </YStack>
                </Stack>
            </Animated.ScrollView>
        </Stack>
    )
}

export default ProfileScreen
