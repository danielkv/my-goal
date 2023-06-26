import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { firebaseProvider } from '@common/providers/firebase'
import ErrorBoundary from '@components/ErrorBoundary'
import { extractUserCredential, setLoggedUser } from '@contexts/user/userContext'
import { NavigationContainer } from '@react-navigation/native'
import { initialLoadUseCase } from '@useCases/init/initialLoad'
import { logMessageUseCase } from '@useCases/log/logMessage'
import { createAppException } from '@utils/exceptions/AppException'
import { getErrorMessage } from '@utils/getErrorMessage'
import AppLayout from '@view/AppLayout'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import 'expo-dev-client'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { TamaguiProvider, Theme } from 'tamagui'

import config from './tamagui.config'

dayjs.locale('pt-br')
dayjs.extend(isBetween)
dayjs.extend(duration)

SplashScreen.preventAutoHideAsync()

export default function App() {
    const [loaded, setLoaded] = useState(false)

    async function initialLoad() {
        try {
            await initialLoadUseCase()
            setLoaded(true)
            return await SplashScreen.hideAsync()
        } catch (err) {
            const logError = createAppException('ERROR_CAUGHT', err)
            logMessageUseCase(logError.toObject())
            Alert.alert('Error', getErrorMessage(err), [{ style: 'default', onPress: () => initialLoad() }])
        }
    }

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {})

        const unsubscribe = firebaseProvider.getAuth().onAuthStateChanged((user) => {
            if (!user?.emailVerified) {
                return setLoggedUser(null)
            }

            setLoggedUser(extractUserCredential(user))
        })

        initialLoad()

        return () => {
            unsubscribe()
        }
    }, [])

    if (!loaded) return null

    return (
        <NavigationContainer>
            <TamaguiProvider config={config}>
                <Theme name={'dark'}>
                    <SafeAreaProvider>
                        <StatusBar style="light" />
                        <ErrorBoundary>
                            <AppLayout />
                        </ErrorBoundary>
                    </SafeAreaProvider>
                </Theme>
            </TamaguiProvider>
        </NavigationContainer>
    )
}
