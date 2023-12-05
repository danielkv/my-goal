import Purchases from 'react-native-purchases'

import { firebaseProvider } from '@common/providers/firebase'
import { useUserContext } from '@contexts/user/userContext'
import { IUser } from '@models/user'
import { getUserSubscriptionInfoUseCase } from '@useCases/subscriptions/getUserSubscriptionInfo'

export const setLoggedUser = async (user: IUser | null): Promise<void> => {
    let subscriptionInfo = null

    if (user?.email) {
        await Purchases.logIn(user.email)
        await firebaseProvider.getAnalytics().setUserId(user.uid)
        //        await firebaseProvider.getAnalytics().logLogin({})
        await firebaseProvider
            .getAnalytics()
            .setUserProperties({ name: user.displayName || '', email: user.email || '' })
        await Purchases.setAttributes({
            $displayName: user.displayName || null,
            $email: user.email,
            $phoneNumber: user.phoneNumber || null,
        })
        subscriptionInfo = await getUserSubscriptionInfoUseCase()
    } else {
        await firebaseProvider.getAnalytics().setUserId(null)

        const isAnonymous = await Purchases.isAnonymous()
        if (!isAnonymous) await Purchases.logOut()
    }

    const userState = useUserContext.getState()

    userState.setSubscriptionInfo(subscriptionInfo)
    userState.setUser(user)
}
