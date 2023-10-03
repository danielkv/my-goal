//export type TAppOfferingIdentifier = 'app_premium_subscription' | 'app_pro_subscription' | 'app_free_subscription'

export type TEntitlementsInfo = Record<string, IEntitlementInfo>

export enum APP_OFFERING {
    APP_PREMIUM_SUBSCRIPTION = 'app_premium_subscription',
    APP_PRO_SUBSCRIPTION = 'app_pro_subscription',
    APP_FREE_SUBSCRIPTION = 'app_free_subscription',
}

export interface IUserSubscriptionInfo {
    managementURL: string | null
    entitlements: TEntitlementsInfo
    activeSubscriptions: string[]
}

export enum PACKAGE_TYPE {
    UNKNOWN = 'UNKNOWN',
    CUSTOM = 'CUSTOM',
    LIFETIME = 'LIFETIME',
    ANNUAL = 'ANNUAL',
    SIX_MONTH = 'SIX_MONTH',
    THREE_MONTH = 'THREE_MONTH',
    TWO_MONTH = 'TWO_MONTH',
    MONTHLY = 'MONTHLY',
    WEEKLY = 'WEEKLY',
}

export interface IPackage {
    readonly identifier: string
    readonly packageType: PACKAGE_TYPE
    readonly product: IStoreProduct
    readonly offeringIdentifier: string
}

export interface IOffering {
    readonly identifier: string
    readonly serverDescription: string
    readonly metadata: {
        [key: string]: unknown
    }
    readonly availablePackages: IPackage[]
    readonly lifetime: IPackage | null
    readonly annual: IPackage | null
    readonly sixMonth: IPackage | null
    readonly threeMonth: IPackage | null
    readonly twoMonth: IPackage | null
    readonly monthly: IPackage | null
    readonly weekly: IPackage | null
}

export interface IStoreProduct {
    readonly identifier: string
    readonly description: string
    readonly title: string
    readonly price: number
    readonly priceString: string
    readonly currencyCode: string
    readonly subscriptionPeriod: string | null
    readonly presentedOfferingIdentifier: string | null
}

export interface IEntitlementInfo {
    readonly identifier: string
    readonly isActive: boolean
    readonly willRenew: boolean
    readonly periodType: string
    readonly latestPurchaseDate: string
    readonly latestPurchaseDateMillis: number
    readonly originalPurchaseDate: string
    readonly originalPurchaseDateMillis: number
    readonly expirationDate: string | null
    readonly expirationDateMillis: number | null
    readonly store: 'PLAY_STORE' | 'APP_STORE' | 'STRIPE' | 'MAC_APP_STORE' | 'PROMOTIONAL' | 'AMAZON' | 'UNKNOWN_STORE'
    readonly productIdentifier: string
    readonly isSandbox: boolean
    readonly unsubscribeDetectedAt: string | null
    readonly unsubscribeDetectedAtMillis: number | null
    readonly billingIssueDetectedAt: string | null
    readonly billingIssueDetectedAtMillis: number | null
    readonly ownershipType: 'FAMILY_SHARED' | 'PURCHASED' | 'UNKNOWN'
}
