import Purchases, { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases'

export const FREE_PACKAGE = {
    identifier: '$rc_free',
    offeringIdentifier: 'free_access',
    packageType: PACKAGE_TYPE.LIFETIME,
    product: {
        identifier: 'free_subscription',
        description: 'Accesso aos timers e PRs',
        title: 'Assinatura Gratuita',
        price: 0,
        priceString: '0',
        currencyCode: 'R$',
        introPrice: null,
        discounts: null,
        productCategory: null,
        subscriptionPeriod: null,
        defaultOption: null,
        subscriptionOptions: null,
        presentedOfferingIdentifier: null,
    },
} as const

export async function getCurrentOfferingUseCase(): Promise<Record<'annual' | 'monthly', PurchasesPackage[]>> {
    const offerings = await Purchases.getOfferings()

    const app_premium_subscription = offerings.all['app_premium_subscription']
    const app_pro_subscription = offerings.all['app_pro_subscription']

    const monthly = [app_pro_subscription.monthly, app_premium_subscription.monthly].filter(
        (a) => a
    ) as PurchasesPackage[]

    const annual = [app_pro_subscription.annual, app_premium_subscription.annual].filter((a) => a) as PurchasesPackage[]

    return {
        monthly,
        annual,
    }
}
