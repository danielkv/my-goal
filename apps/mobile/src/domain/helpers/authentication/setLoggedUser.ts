import Purchases from 'react-native-purchases'

import { useUserContext } from '@contexts/user/userContext'
import { IUser } from '@models/user'
import { getUserSubscriptionInfoUseCase } from '@useCases/subscriptions/getUserSubscriptionInfo'

export const setLoggedUser = async (user: IUser | null): Promise<void> => {
    let subscriptionInfo = null

    if (user?.email) {
        await Purchases.logIn(user.email)
        await Purchases.setAttributes({
            $displayName: user.displayName || null,
            $email: user.email,
            $phoneNumber: user.phoneNumber || null,
        })
        subscriptionInfo = await getUserSubscriptionInfoUseCase()
    } else {
        if (!(await Purchases.isAnonymous())) await Purchases.logOut()
    }

    const userState = useUserContext.getState()

    userState.setSubscriptionInfo(subscriptionInfo)
    userState.setUser(user)
}
