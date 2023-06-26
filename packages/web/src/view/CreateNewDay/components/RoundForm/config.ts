import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { IEventMovement, IMovementWeight, IRound, TWeightTypes } from '@models/block'
import { createEventRoundValues } from '@utils/worksheetInitials'

export type TRoundForm = IRound & {
    each?: number
    timecap?: number
    work?: number
    rest?: number
    time?: number
    numberOfRounds?: number
}

export const roundInitialValues: TRoundForm = createEventRoundValues()

export const weightTypes: { key: TWeightTypes; label: string }[] = [
    { key: 'none', label: 'Sem carga' },
    { key: '%', label: 'Porcentagem' },
    { key: 'kg', label: 'Kilos' },
    { key: 'lb', label: 'Libras' },
]

export const eventRoundFormSchema = z.object({
    type: z.string(),
    movements: z.array(
        z.object<ZodShape<IEventMovement>>({
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
                    .object<ZodShape<IMovementWeight>>({
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
