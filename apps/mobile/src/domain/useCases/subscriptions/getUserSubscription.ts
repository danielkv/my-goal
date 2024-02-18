import Purchases from 'react-native-purchases'

import { APP_ENTITLEMENTS, IEntitlementDetails, IStoreProduct } from 'goal-models'
import { APP_ENTITLEMENT_DESCRIPTIONS, FREE_ENTITLEMENTS, FREE_PRODUCT } from 'goal-utils'
import { alphabetical } from 'radash'

interface UserSubscription {
    subscriptions: IStoreProduct[]
    entitlements: IEntitlementDetails[]
}

export async function getUserSubscriptions(): Promise<UserSubscription> {
    const {
        entitlements: { active },
        activeSubscriptions,
    } = await Purchases.getCustomerInfo()

    const entitlements = alphabetical(
        Object.values(active),
        (ent) => APP_ENTITLEMENT_DESCRIPTIONS[ent.identifier as APP_ENTITLEMENTS]
    )

    if (!entitlements.length) {
        return { entitlements: FREE_ENTITLEMENTS, subscriptions: [FREE_PRODUCT] }
    }

    const offerings = await Purchases.getOfferings()

    const subscriptions = Object.values(offerings.all).flatMap((off) =>
        off.availablePackages
            .filter((pkg) => activeSubscriptions.includes(pkg.product.identifier))
            .map((pkg) => pkg.product)
    )

    return {
        entitlements: entitlements,
        subscriptions,
    }
}
