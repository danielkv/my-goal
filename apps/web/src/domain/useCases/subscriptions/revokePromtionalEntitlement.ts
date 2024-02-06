import { APP_ENTITLEMENTS } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function revokePromotionalEntitlementUseCase(
    app_user_id: string,
    entitlement_identifier: APP_ENTITLEMENTS
): Promise<void> {
    const { error } = await supabase.functions.invoke('revenueCat/revokePromotionalEntitlement/', {
        method: 'POST',
        body: {
            app_user_id,
            entitlement_identifier,
        },
    })
    if (error) throw error
}
