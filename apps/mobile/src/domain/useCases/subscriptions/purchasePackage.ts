import Purchases, { PurchasesPackage } from 'react-native-purchases'

import { useUserContext } from '@contexts/user/userContext'

export async function purchasePackageUseCase(pkg: PurchasesPackage) {
    const result = await Purchases.purchasePackage(pkg)

    const { activeSubscriptions, entitlements } = result.customerInfo

    useUserContext.getState().setSubscriptionInfo({ activeSubscriptions, entitlements: entitlements.active })
}
