import { APP_ENTITLEMENTS } from 'goal-models'
import { PromotionalPeriod } from 'goal-utils'
import { all } from 'radash'

import { supabase } from '@common/providers/supabase'

export async function grantPromotionalEntitlementUseCase(
    app_user_id: string | string[],
    entitlement_identifier: APP_ENTITLEMENTS | APP_ENTITLEMENTS[],
    duration: PromotionalPeriod,
    start_time_ms?: number
): Promise<void> {
    const ents = Array.isArray(entitlement_identifier) ? entitlement_identifier : [entitlement_identifier]
    const users = Array.isArray(app_user_id) ? app_user_id : [app_user_id]

    const responses = await all(
        users.flatMap((user) =>
            ents.map((ent) =>
                supabase.functions.invoke('revenueCat/grantPromotionalEntitlement/', {
                    method: 'POST',
                    body: {
                        app_user_id: user,
                        entitlement_identifier: ent,
                        duration,
                        start_time_ms,
                    },
                })
            )
        )
    )

    responses.forEach(({ error }) => {
        if (error) throw error
    })
}
