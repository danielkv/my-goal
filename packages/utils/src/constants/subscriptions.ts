import { APP_ENTITLEMENTS, IEntitlementInfo, IOffering, IPackage, IStoreProduct, PACKAGE_TYPE } from 'goal-models'

export const APP_ENTITLEMENT_DESCRIPTIONS: Record<APP_ENTITLEMENTS, string> = {
    weekly_workout_access: 'Acesso às planilhas semanais',
    community_groups_access: 'Acesso aos grupos da comunidade',
    follow_community_results: 'Acompanhar resultados dos treinos da comunidade',
    save_workout_result: 'Salvar resultado do Workout',
    free_access: 'Acesso gratuito',
}

export const FREE_PRODUCT: IStoreProduct = {
    identifier: 'free_subscription',
    description: 'Assinatura Gratuita',
    title: 'Assinatura Gratuita',
    price: 0,
    priceString: '0',
    currencyCode: 'R$',
    subscriptionPeriod: null,
    presentedOfferingIdentifier: null,
}

export const FREE_ENTITLEMENT: IEntitlementInfo = {
    identifier: 'free_access',
    isActive: true,
    willRenew: true,
    periodType: '',
    latestPurchaseDate: '',
    latestPurchaseDateMillis: 0,
    originalPurchaseDate: '',
    originalPurchaseDateMillis: 0,
    expirationDate: null,
    expirationDateMillis: null,
    store: 'UNKNOWN_STORE',
    productIdentifier: FREE_PRODUCT.identifier,
    isSandbox: false,
    unsubscribeDetectedAt: null,
    unsubscribeDetectedAtMillis: null,
    billingIssueDetectedAt: null,
    billingIssueDetectedAtMillis: null,
    ownershipType: 'UNKNOWN',
}

export const FREE_PACKAGE: IPackage = {
    identifier: '$rc_free',
    offeringIdentifier: 'free_access',
    packageType: PACKAGE_TYPE.LIFETIME,
    product: FREE_PRODUCT,
}

export const FREE_OFFERING: IOffering = {
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
