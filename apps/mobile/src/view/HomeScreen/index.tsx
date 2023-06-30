import { ImageBackground } from 'react-native'

import { YStack } from 'tamagui'
import { Image } from 'tamagui'

import HomeBG from '@assets/images/home-bg.png'
import LogoGoal from '@assets/images/logo-goal.png'
import Button from '@components/Button'
import { useLoggedUser } from '@contexts/user/userContext'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { FileSpreadsheet, LogIn } from '@tamagui/lucide-icons'

const HomeScreen: React.FC = () => {
    const { navigate } = useNavigation()
    const user = useLoggedUser()

    return (
        <ImageBackground style={{ flex: 1 }} source={HomeBG}>
            <YStack p="$5" f={1} ai="center" jc="flex-end">
                <Image source={LogoGoal} w={140} h={60} resizeMode="contain" alt="Logo Goal" mb="$10" />
                {user ? (
                    <Button
                        variant="primary"
                        onPress={() => navigate(ERouteName.WorksheetListScreen)}
                        icon={() => <FileSpreadsheet size={18} color="white" />}
                    >
                        Planilhas
                    </Button>
                ) : (
                    <>
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
                    </>
                )}
            </YStack>
        </ImageBackground>
    )
}

export default HomeScreen
