import Purchases, { PRORATION_MODE, PurchasesPackage } from 'react-native-purchases'

import { useUserContext } from '@contexts/user/userContext'

export async function purchasePackageUseCase(pkg: PurchasesPackage) {
    const { activeSubscriptions: oldActiveSubscriptions } = await Purchases.getCustomerInfo()

    console.log(oldActiveSubscriptions)

    const googleProductChangeInfo = oldActiveSubscriptions.length
        ? {
              prorationMode: PRORATION_MODE.DEFERRED,
              oldProductIdentifier: oldActiveSubscriptions[0],
          }
        : null
    const result = await Purchases.purchasePackage(pkg)

    const { activeSubscriptions, entitlements, managementURL } = result.customerInfo

    useUserContext
        .getState()
        .setSubscriptionInfo({ activeSubscriptions, entitlements: entitlements.active, managementURL })
}
