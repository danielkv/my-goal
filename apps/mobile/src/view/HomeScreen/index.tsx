import { ImageBackground } from 'react-native'

import Constants from 'expo-constants'
import { Image, Text, YStack } from 'tamagui'

import HomeBG from '@assets/images/home-bg.png'
import LogoGoal from '@assets/images/logo-goal.png'
import Button from '@components/Button'
import { useLoggedUser } from '@contexts/user/userContext'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { FileSpreadsheet, LogIn } from '@tamagui/lucide-icons'

import HomeOnboarding from './components/HomeOnboarding'

const HomeScreen: React.FC = () => {
    const { navigate } = useNavigation()
    const user = useLoggedUser()

    return (
        <ImageBackground style={{ flex: 1 }} source={HomeBG}>
            <YStack px="$6" py="$3.5" f={1} ai="center" jc="flex-end">
                <Image source={LogoGoal} w={140} h={60} resizeMode="contain" alt="Logo Goal" mb="$6" />
                {user ? (
                    <Button
                        variant="primary"
                        onPress={() => navigate(ERouteName.WorksheetListScreen)}
                        icon={() => <FileSpreadsheet size={18} color="white" />}
                    >
                        Planilhas
                    </Button>
                ) : (
                    <Button
                        bg="white"
                        pressStyle={{ bg: '$gray2' }}
                        color="$gray9"
                        fontWeight="700"
                        onPress={() => navigate(ERouteName.LoginScreen)}
                        icon={<LogIn />}
                    >
                        Acessar
                    </Button>
                )}
                {!!Constants.expoConfig?.version && (
                    <Text mt="$3.5" ta="center" mb="$3" fontSize="$3" color="$gray5">
                        v{Constants.expoConfig?.version}
                    </Text>
                )}
            </YStack>
            <HomeOnboarding />
        </ImageBackground>
    )
}

export default HomeScreen
