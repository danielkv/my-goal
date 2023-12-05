import { useUserContext } from '@contexts/user/userContext'

export function userHasActiveSubscriptionUseCase(subscriptionId: string) {
    const userContextState = useUserContext.getState()
    if (!userContextState) throw new Error('Nenhum usuário logado')

    return !!userContextState.subscriptionInfo?.activeSubscriptions.includes(subscriptionId)
}
