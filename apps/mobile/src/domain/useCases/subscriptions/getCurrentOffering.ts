import Purchases, { PACKAGE_TYPE, PurchasesOffering } from 'react-native-purchases'

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

export async function getCurrentOfferingUseCase(): Promise<PurchasesOffering | null> {
    const offerings = await Purchases.getOfferings()

    return offerings.current
}
