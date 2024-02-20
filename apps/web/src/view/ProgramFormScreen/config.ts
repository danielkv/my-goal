import { IProgramInput } from 'goal-models'
import { z } from 'zod'

export type TProgramForm = IProgramInput

export const programInitialValues: TProgramForm = {
    amount: 0,
    block_segments: 'weekly',
    expiration: 365,
    image: '',
    name: '',
    segments: [],
}

export const programFormSchema = z.object({
    name: z.string(),
    amount: z.number(),
    block_segments: z.enum(['none', 'weekly', 'monthly']),
    expiration: z.number(),
    segments: z
        .object({
            name: z.string(),
            sessions: z
                .object({
                    name: z.string(),
                    classes: z
                        .object({
                            name: z.string(),
                            video: z.string(),
                            text: z.string(),
                        })
                        .array(),
                })
                .array(),
        })
        .array(),
})
