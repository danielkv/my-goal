import { useUserContext } from '@contexts/user/userContext'

export function userHasEntitlementUseCase(entitlementId: string) {
    const userContextState = useUserContext.getState()
    if (!userContextState) throw new Error('Nenhum usuário logado')

    return !!userContextState.subscriptionInfo?.entitlements[entitlementId]
}
