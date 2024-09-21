import { Platform } from 'react-native'
import Purchases, { LOG_LEVEL } from 'react-native-purchases'

import { IUserSubscriptionInfo } from 'goal-models'

import { useUserContext } from '@contexts/user/userContext'

const apiKey = Platform.select<string>({
    ios: process.env.EXPO_PUBLIC_REVENUE_CAT_APPLE_KEY,
    android: process.env.EXPO_PUBLIC_REVENUE_CAT_GOOGLE_KEY,
})

export function configureSubscriptionsUseCase() {
    if (!apiKey) throw new Error('Purchases API_KEY not set')
    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.INFO)

    Purchases.addCustomerInfoUpdateListener((info) => {
        const normalizedInfo: IUserSubscriptionInfo = {
            activeSubscriptions: info.activeSubscriptions,
            entitlements: info.entitlements.active,
            managementURL: info.managementURL,
        }

        useUserContext.getState().setSubscriptionInfo(normalizedInfo)
    })

    Purchases.configure({ apiKey })
}
