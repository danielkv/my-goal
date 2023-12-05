import { APP_ENTITLEMENTS } from 'goal-models'
import { FAKE_ENTITLEMENTS } from 'goal-utils'

import { useUserContext } from '@contexts/user/userContext'

export function userIsEntitledUseCase(entitlementId: APP_ENTITLEMENTS | APP_ENTITLEMENTS[], and = true): boolean {
    const userContextState = useUserContext.getState()
    if (!userContextState) throw new Error('Nenhum usuário logado')

    const entitlements = Array.isArray(entitlementId) ? entitlementId : [entitlementId]
    const userEntitlements = __DEV__ ? FAKE_ENTITLEMENTS : userContextState.subscriptionInfo?.entitlements

    if (!userEntitlements) return false

    return and
        ? entitlements.every((entId) => !!userEntitlements[entId]?.isActive)
        : entitlements.some((entId) => !!userEntitlements[entId]?.isActive)
}
