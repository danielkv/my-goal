import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import * as SplashScreen from 'expo-splash-screen'

import { firebaseProvider } from '@common/providers/firebase'
import { extractUserCredential } from '@contexts/user/userContext'
import { setLoggedUser } from '@helpers/authentication/setLoggedUser'
import { initialLoadUseCase } from '@useCases/init/initialLoad'
import { configureSubscriptionsUseCase } from '@useCases/subscriptions/configureSubscriptions'
import { getErrorMessage } from '@utils/getErrorMessage'

configureSubscriptionsUseCase()

export function useInitialLoad() {
    const [loaded, setLoaded] = useState(false)

    async function initialLoad() {
        try {
            await initialLoadUseCase()
            setLoaded(true)
            return await SplashScreen.hideAsync()
        } catch (err) {
            Alert.alert('Error', getErrorMessage(err), [{ style: 'default', onPress: () => initialLoad() }])
        }
    }

    useEffect(() => {
        const unsubscribe = firebaseProvider.getAuth().onAuthStateChanged((user) => {
            if (!user?.emailVerified) {
                return setLoggedUser(null)
            }

            return setLoggedUser(extractUserCredential(user))
        })

        const unsubscribeUserChange = firebaseProvider.getAuth().onUserChanged((user) => {
            if (!user?.emailVerified) {
                return setLoggedUser(null)
            }

            return setLoggedUser(extractUserCredential(user))
        })

        initialLoad()

        return () => {
            unsubscribe()
            unsubscribeUserChange()
        }
    }, [])

    return { loaded }
}
