import { IRound, TWeightTypes } from 'goal-models'
import { z } from 'zod'

import { createEventRoundValues } from '@utils/worksheetInitials'

export type TRoundForm = IRound

export const roundInitialValues: TRoundForm = createEventRoundValues()

export const weightTypes: { key: TWeightTypes; label: string }[] = [
    { key: 'none', label: 'Sem carga' },
    { key: '%', label: 'Porcentagem' },
    { key: 'kg', label: 'Kilos' },
    { key: 'lb', label: 'Libras' },
]

export const eventRoundFormSchema = z.object({
    type: z.string().optional(),
    movements: z.array(
        z.object({
            name: z
                .string({
                    required_error: 'Nome é obrigatório',
                    invalid_type_error: 'Não é um texto',
                })
                .nonempty('Nome é obrigatório'),
            reps: z.string(),
            videoUrl: z.optional(z.string()),
            weight: z.optional(
                z
                    .object({
                        type: z.enum(['none', 'kg', 'lb', '%']),
                        value: z.custom<string>(),
                    })
                    .superRefine((values, ctx) => {
                        if (values.type !== 'none' && !values.value)
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: 'Peso é obrigatório',
                                path: ['value'],
                            })

                        ctx
                    })
            ),
        })
    ),
})
