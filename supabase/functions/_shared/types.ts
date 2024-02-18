import z from 'https://deno.land/x/zod@v3.22.4/index.ts'

export const promotionalPeriodSchema = z.enum([
    'daily',
    'three_day',
    'weekly',
    'monthly',
    'two_month',
    'three_month',
    'six_month',
    'yearly',
    'lifetime',
])

export type PromotionalPeriod = z.infer<typeof promotionalPeriodSchema>
