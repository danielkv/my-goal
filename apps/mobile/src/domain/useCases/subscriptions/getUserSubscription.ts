import Purchases from 'react-native-purchases'

import { IEntitlementInfo, IStoreProduct } from 'goal-models'
import { FREE_ENTITLEMENT, FREE_PRODUCT } from 'goal-utils'

interface UserSubscription {
    entitlement: IEntitlementInfo
    product: IStoreProduct
}

export async function getUserSubscriptions(): Promise<UserSubscription[]> {
    const userInfo = await Purchases.getCustomerInfo()
    const entitlements = Object.values(userInfo.entitlements.active)

    if (!entitlements.length) {
        return [{ entitlement: FREE_ENTITLEMENT, product: FREE_PRODUCT }]
    }

    const productIds = entitlements.map((ent) => ent.productIdentifier)

    const products = await Purchases.getProducts(productIds)

    return entitlements.reduce<UserSubscription[]>((all, entitlement) => {
        const product = products.find((prod) => prod.identifier === entitlement.productIdentifier)

        if (product)
            all.push({
                entitlement,
                product,
            })

        return all
    }, [])
}
