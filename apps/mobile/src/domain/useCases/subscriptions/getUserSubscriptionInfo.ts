import Purchases from 'react-native-purchases'

import { IUserSubscriptionInfo } from 'goal-models'

import { useUserContext } from '@contexts/user/userContext'

export async function getUserSubscriptionInfoUseCase(): Promise<IUserSubscriptionInfo> {
    const userContextState = useUserContext.getState()
    if (!userContextState) throw new Error('Nenhum usuário logado')

    const info = await Purchases.getCustomerInfo()

    return {
        managementURL: info.managementURL,
        entitlements: info.entitlements.active,
        activeSubscriptions: info.activeSubscriptions,
    }
}
