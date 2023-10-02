export interface IUserData {
    readonly uid: string
    readonly email?: string
    readonly emailVerified: boolean
    readonly displayName?: string
    readonly photoURL?: string | null
    readonly phoneNumber?: string
}

export interface IUserSubscriptionInfo {
    managementURL: string | null
    entitlements: TEntitlementsInfo
    activeSubscriptions: string[]
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

export type TEntitlementsInfo = Record<string, IEntitlementInfo>
