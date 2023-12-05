import { useEffect, useRef } from 'react'
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

import { firebaseProvider } from '@common/providers/firebase'
import AppAlertProvider from '@components/AppAlert/provider'
import ErrorBoundary from '@components/ErrorBoundary'
import { PortalProvider } from '@gorhom/portal'
import { useInitialLoad } from '@hooks/authentication/useInitialLoad'
import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'
import AppLayout from '@view/AppLayout'

import config from './tamagui.config'

LogBox.ignoreLogs(['new NativeEventEmitter'])

dayjs.locale('pt-br')
dayjs.extend(isBetween)
dayjs.extend(duration)

SplashScreen.preventAutoHideAsync()

export default function App() {
    const { loaded } = useInitialLoad()
    const routeNameRef = useRef('')
    const navigationRef = useRef<NavigationContainerRef<TReactNavigationStackParamList>>(null)

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {})
    }, [])

    if (!loaded) return null

    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name || ''
            }}
            onStateChange={async () => {
                const previousRouteName = routeNameRef.current
                const currentRoute = navigationRef.current?.getCurrentRoute()
                const currentRouteName = currentRoute?.name || ''

                if (!currentRouteName) return

                if (previousRouteName !== currentRouteName) {
                    const payload: FirebaseAnalyticsTypes.ScreenViewParameters = {
                        screen_name: currentRouteName,
                        screen_class: currentRouteName,
                    }
                    if (currentRoute?.params) payload.params = currentRoute.params

                    await firebaseProvider.getAnalytics().logScreenView(payload)
                }
                routeNameRef.current = currentRouteName
            }}
        >
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
