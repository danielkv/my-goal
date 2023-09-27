import { useEffect } from 'react'
import { LogBox } from 'react-native'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import 'expo-dev-client'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { TamaguiProvider, Theme } from 'tamagui'

import AppAlertProvider from '@components/AppAlert/provider'
import ErrorBoundary from '@components/ErrorBoundary'
import { PortalProvider } from '@gorhom/portal'
import { useInitialLoad } from '@hooks/authentication/useInitialLoad'
import { NavigationContainer } from '@react-navigation/native'
import AppLayout from '@view/AppLayout'

import config from './tamagui.config'

LogBox.ignoreLogs(['new NativeEventEmitter'])

dayjs.locale('pt-br')
dayjs.extend(isBetween)
dayjs.extend(duration)

SplashScreen.preventAutoHideAsync()

export default function App() {
    const { loaded } = useInitialLoad()

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {})
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
