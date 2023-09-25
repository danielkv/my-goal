import { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import { LogBox } from 'react-native'
import Purchases, { LOG_LEVEL, PurchasesOffering } from 'react-native-purchases'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import * as Application from 'expo-application'
import 'expo-dev-client'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { TamaguiProvider, Theme } from 'tamagui'

import { firebaseProvider } from '@common/providers/firebase'
import AppAlertProvider from '@components/AppAlert/provider'
import ErrorBoundary from '@components/ErrorBoundary'
import { extractUserCredential, setLoggedUser } from '@contexts/user/userContext'
import { PortalProvider } from '@gorhom/portal'
import { NavigationContainer } from '@react-navigation/native'
import { initialLoadUseCase } from '@useCases/init/initialLoad'
import { logMessageUseCase } from '@useCases/log/logMessage'
import { createAppException } from '@utils/exceptions/AppException'
import { getErrorMessage } from '@utils/getErrorMessage'
import AppLayout from '@view/AppLayout'

import config from './tamagui.config'

LogBox.ignoreLogs(['new NativeEventEmitter'])

dayjs.locale('pt-br')
dayjs.extend(isBetween)
dayjs.extend(duration)

SplashScreen.preventAutoHideAsync()

const APIKeys = {
    apple: 'appl_ZMlLZgdpHCIslayeeznLXslcGLj',
    google: 'goog_SdIlPNjGwLjPWYyhSEDQtwSJYIS',
}

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
        const setup = async () => {
            if (Platform.OS == 'android') {
                Purchases.configure({ apiKey: APIKeys.google })
            } else {
                Purchases.configure({ apiKey: APIKeys.apple })
            }

            const offerings = await Purchases.getOfferings()
            console.log(offerings.current)
        }

        Purchases.setLogLevel(LOG_LEVEL.VERBOSE)

        setup().catch(console.log)
    }, [])

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {})

        const unsubscribe = firebaseProvider.getAuth().onAuthStateChanged((user) => {
            if (!user?.emailVerified) {
                return setLoggedUser(null)
            }

            setLoggedUser(extractUserCredential(user))
        })

        const unsubscribeUserChange = firebaseProvider.getAuth().onUserChanged((user) => {
            if (!user?.emailVerified) {
                return setLoggedUser(null)
            }

            setLoggedUser(extractUserCredential(user))
        })

        initialLoad()

        return () => {
            unsubscribe()
            unsubscribeUserChange()
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
                            <PortalProvider>
                                <AppAlertProvider>
                                    <AppLayout />
                                </AppAlertProvider>
                            </PortalProvider>
                        </ErrorBoundary>
                    </SafeAreaProvider>
                </Theme>
            </TamaguiProvider>
        </NavigationContainer>
    )
}
