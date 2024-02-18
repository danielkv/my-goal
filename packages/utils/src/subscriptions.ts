import { APP_ENTITLEMENTS, IEntitlementAPIList } from 'goal-models'

export const availableSubscriptions = {
    pro: [APP_ENTITLEMENTS.SAVE_WORKOUT_RESULT, APP_ENTITLEMENTS.WEEKLY_WORKOUT_ACCESS],
    premium: [
        APP_ENTITLEMENTS.SAVE_WORKOUT_RESULT,
        APP_ENTITLEMENTS.WEEKLY_WORKOUT_ACCESS,
        APP_ENTITLEMENTS.FOLLOW_COMMUNITY_RESULTS,
        APP_ENTITLEMENTS.COMMUNITY_GROUPS_ACCESS,
    ],
}

export const mappedSubscriptions: Record<keyof typeof availableSubscriptions, string> = {
    pro: 'Assinatura Pro',
    premium: 'Assinatura Premium',
}

export const mappedPromotionalPeriod = {
    daily: '1 dia',
    three_day: '3 dias',
    weekly: '1 semana',
    monthly: '1 mês',
    two_month: '2 meses',
    three_month: '3 meses',
    six_month: '6 meses',
    yearly: '1 ano',
    lifetime: 'Lifetime',
}

export type PromotionalPeriod = keyof typeof mappedPromotionalPeriod

export function getCurrentSubscription(
    entitlements: IEntitlementAPIList
): keyof typeof availableSubscriptions | 'none' {
    const arr = Object.keys(entitlements)
    if (availableSubscriptions.pro.every((ent) => arr.includes(ent))) return 'pro'
    if (availableSubscriptions.premium.every((ent) => arr.includes(ent))) return 'premium'
    return 'none'
}
