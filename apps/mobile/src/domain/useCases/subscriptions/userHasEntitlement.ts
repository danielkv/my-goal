import { APP_ENTITLEMENTS } from 'goal-models'

import { useUserContext } from '@contexts/user/userContext'

export function userIsEntitledUseCase(entitlementId: APP_ENTITLEMENTS | APP_ENTITLEMENTS[], and = true): boolean {
    const userContextState = useUserContext.getState()
    if (!userContextState) throw new Error('Nenhum usuário logado')

    const entitlements = Array.isArray(entitlementId) ? entitlementId : [entitlementId]

    return and
        ? entitlements.every((entId) => !!userContextState.subscriptionInfo?.entitlements[entId]?.isActive)
        : entitlements.some((entId) => !!userContextState.subscriptionInfo?.entitlements[entId]?.isActive)
}
