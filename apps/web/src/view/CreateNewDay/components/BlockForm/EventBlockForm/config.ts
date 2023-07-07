import { IEventBlock } from 'goal-models'
import { z } from 'zod'

import { createEventBlockValues } from '@utils/worksheetInitials'

import { eventRoundFormSchema } from '../../RoundForm/config'

export type TEventBlockForm = IEventBlock

export const eventBlockInitialValues: TEventBlockForm = createEventBlockValues()

export const eventBlockFormSchema = z
    .object({
        event_type: z.string(),
        name: z.optional(z.string()),
        timecap: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
        each: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
        numberOfRounds: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
        work: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
        rest: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
        rounds: z.array(eventRoundFormSchema),
    })
    .superRefine((values, ctx) => {
        if (values.event_type === 'emom') {
            if (!values.each)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Campo 'cada' é obrigatório para EMOM",
                    path: ['each'],
                })

            if (!values.numberOfRounds)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Campo 'por' é obrigatório para EMOM",
                    path: ['numberOfRounds'],
                })
        } else if (values.event_type !== 'not_timed') {
            if (values.timecap === 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Campo 'timecap' é obrigatório",
                    path: ['timecap'],
                })
            }
        }
    })
