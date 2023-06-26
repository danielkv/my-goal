import { ImageBackground } from 'react-native'

import HomeBG from '@assets/images/home-bg.png'
import LogoGoal from '@assets/images/logo-goal.png'
import Button from '@components/Button'
import { useLoggedUser } from '@contexts/user/userContext'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'

import { Stack, YStack } from 'tamagui'
import { Image } from 'tamagui'

const HomeScreen: React.FC = () => {
    const { navigate } = useNavigation()
    const user = useLoggedUser()

    return (
        <ImageBackground style={{ flex: 1 }} source={HomeBG}>
            <YStack px="$4" pt="$8" f={1}>
                <Stack f={1} mt="$12" ai="center">
                    <Image source={LogoGoal} w={140} h={60} resizeMode="contain" alt="Logo Goal" />
                </Stack>
                <YStack gap="$5" mb="$10">
                    {user ? (
                        <Button variant="primary" onPress={() => navigate(ERouteName.WorksheetListScreen)}>
                            Planilhas
                        </Button>
                    ) : (
                        <>
                            <Button variant="primary" onPress={() => navigate(ERouteName.LoginScreen)}>
                                Logar
                            </Button>
                            <Button variant="primary" onPress={() => navigate(ERouteName.SubscriptionScreen)}>
                                Cadastrar
                            </Button>
                        </>
                    )}

                    <Button variant="primary" onPress={() => navigate(ERouteName.TimersScreen)}>
                        Timers
                    </Button>
                </YStack>
            </YStack>
        </ImageBackground>
    )
}

export default HomeScreen
