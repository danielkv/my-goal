import { ImageBackground } from 'react-native'

import { ScrollView, getTokens } from 'tamagui'

import LoginBg from '@assets/images/login-bg.png'
import SafeAreaView from '@components/SafeAreaView'
import { useLoggedUser } from '@contexts/user/userContext'

import CreateNewUser from './components/CreateNewUser'
import UpdateUser from './components/UpdateUser'

const SubscriptionScreen: React.FC = () => {
    const { size } = getTokens()
    const user = useLoggedUser()

    return (
        <SafeAreaView flex={1}>
            <ImageBackground style={{ flex: 1 }} resizeMode="cover" source={LoginBg}>
                <ScrollView
                    flex={1}
                    contentContainerStyle={{ padding: size[3].val }}
                    keyboardShouldPersistTaps="handled"
                >
                    {user ? <UpdateUser /> : <CreateNewUser />}
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default SubscriptionScreen
