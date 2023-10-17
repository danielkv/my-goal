import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import dayjs from 'dayjs'
import * as SplashScreen from 'expo-splash-screen'
import * as StoreReview from 'expo-store-review'

import { useStorage } from '@common/hooks/useStorage'
import { firebaseProvider } from '@common/providers/firebase'
import { extractUserCredential } from '@contexts/user/userContext'
import { setLoggedUser } from '@helpers/authentication/setLoggedUser'
import { initialLoadUseCase } from '@useCases/init/initialLoad'
import { configureSubscriptionsUseCase } from '@useCases/subscriptions/configureSubscriptions'
import { getErrorMessage } from '@utils/getErrorMessage'

configureSubscriptionsUseCase()

const EXPIRES_APP_REVIEW = 7 // days
const EXPIRES_APP_REVIEW_PERIOD = 'day'

export function useInitialLoad() {
    const [loaded, setLoaded] = useState(false)
    const [askedReview, setAskedReview] = useState(false)

    const { currentValue, setItem } = useStorage<string | null>('@lastInAppReview', null)

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
        if (!loaded || askedReview) return

        if (!currentValue) {
            setItem(Date.now().toString())

            return
        }

        const compareDate = dayjs().subtract(EXPIRES_APP_REVIEW, EXPIRES_APP_REVIEW_PERIOD)
        const isExpired = compareDate.isAfter(Number(currentValue), EXPIRES_APP_REVIEW_PERIOD)

        if (!isExpired) return

        setTimeout(() => {
            StoreReview.isAvailableAsync().then((result) => {
                if (!result) return
                return StoreReview.hasAction().then((result) => {
                    setAskedReview(true)
                    setItem(Date.now().toString())
                    if (!result) return
                    return StoreReview.requestReview()
                })
            })
        }, 2000)
    }, [loaded, currentValue, askedReview])

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
