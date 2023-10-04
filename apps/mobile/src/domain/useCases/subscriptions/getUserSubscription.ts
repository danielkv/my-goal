import Purchases from 'react-native-purchases'

import { APP_ENTITLEMENTS, IEntitlementInfo, IStoreProduct } from 'goal-models'
import { APP_ENTITLEMENT_DESCRIPTIONS, FREE_ENTITLEMENT, FREE_PRODUCT } from 'goal-utils'
import { alphabetical } from 'radash'

interface UserSubscription {
    subscriptions: IStoreProduct[]
    entitlements: IEntitlementInfo[]
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
        return { entitlements: [FREE_ENTITLEMENT], subscriptions: [FREE_PRODUCT] }
    }

    const subscriptions = await Purchases.getProducts(activeSubscriptions)

    return {
        entitlements: entitlements,
        subscriptions,
    }
}
