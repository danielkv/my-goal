import { IEntitlementAPIList, ISubscriptionAPIList, Models } from 'goal-models'

import { supabase } from '@common/providers/supabase'

interface TResponse extends Models<'users'> {
    entitlements: IEntitlementAPIList
    subscriptions: ISubscriptionAPIList
}

export async function getUserDetailsUseCase(id: string): Promise<TResponse> {
    const { error: subscriberError, data: subscriberData } = await supabase.functions.invoke<TResponse>(`users/${id}`, {
        method: 'GET',
    })
    if (subscriberError) throw subscriberError
    if (!subscriberData) throw new Error('Usuário não encontrado')

    return subscriberData
}
