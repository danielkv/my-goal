import { promotionalPeriodSchema } from '../_shared/types.ts'
import z from 'https://deno.land/x/zod@v3.22.4/index.ts'

export const grantPromotionalEntitlementSchema = z.object({
    app_user_id: z.string(),
    entitlement_identifier: z.string(),
    duration: promotionalPeriodSchema,
    start_time_ms: z.number().optional(),
})

export type GrantPromotionalEntitlementBody = z.infer<typeof grantPromotionalEntitlementSchema>

export const revokePromotionalEntitlementSchema = z.object({
    app_user_id: z.string(),
    entitlement_identifier: z.string(),
})

export type RevokePromotionalEntitlementBody = z.infer<typeof revokePromotionalEntitlementSchema>
