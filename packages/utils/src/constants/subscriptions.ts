import {
    APP_ENTITLEMENTS,
    IEntitlementInfo,
    IOffering,
    IPackage,
    IStoreProduct,
    PACKAGE_TYPE,
    STORES,
} from 'goal-models'

export const APP_ENTITLEMENT_DESCRIPTIONS: Record<APP_ENTITLEMENTS, string> = {
    weekly_workout_access: 'Acesso às planilhas semanais',
    community_groups_access: 'Acesso aos grupos da comunidade',
    follow_community_results: 'Acompanhar resultados dos treinos da comunidade',
    save_workout_result: 'Salvar resultado do Workout',
    save_pr: 'Salvar PRs',
    timer: 'Acessar Timers',
}

export const APP_STORES_DESCRIPTIONS: Record<STORES, string> = {
    AMAZON: 'Amazon',
    APP_STORE: 'App Store',
    MAC_APP_STORE: 'Mac App Store',
    PLAY_STORE: 'Play Store',
    PROMOTIONAL: 'Promocional',
    STRIPE: 'Stripe',
    UNKNOWN_STORE: 'Desconhecida',
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

export const SAVE_PR_ENTITLEMENT: IEntitlementInfo = {
    identifier: 'save_pr',
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
export const TIMER_ENTITLEMENT: IEntitlementInfo = {
    identifier: 'timer',
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

export const FREE_ENTITLEMENTS = [SAVE_PR_ENTITLEMENT, TIMER_ENTITLEMENT]

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
