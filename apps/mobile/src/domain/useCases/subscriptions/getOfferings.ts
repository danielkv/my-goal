import Purchases, { PACKAGE_TYPE, PurchasesOffering, PurchasesPackage } from 'react-native-purchases'

export const FREE_PACKAGE: PurchasesPackage = {
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

const FREE_OFFERING: PurchasesOffering = {
    identifier: 'app_free_subscription',
    serverDescription: 'Assinatura Gratuita',
    metadata: { description: ['Acesso aos timers', 'Salvar PRs'] },
    availablePackages: [FREE_PACKAGE],
    lifetime: FREE_PACKAGE,
    annual: null,
    monthly: null,
    sixMonth: null,
    threeMonth: null,
    twoMonth: null,
    weekly: null,
}

export async function getOfferingsUseCase(): Promise<PurchasesOffering[]> {
    const offerings = await Purchases.getOfferings()

    return [FREE_OFFERING, offerings.all['app_pro_subscription'], offerings.all['app_premium_subscription']]
}
