import { IProgramInput, IProgramSegmentInput, IProgramSessionInput, ModelsInsert } from 'goal-models'
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

export const createEmptyClass = (o?: Partial<ModelsInsert<'program_classes'>>): ModelsInsert<'program_classes'> => ({
    id: '',
    created_at: '',
    session_id: '',
    name: '',
    text: '',
    video: '',
    ...o,
})
export const createEmptySession = (o?: Partial<IProgramSessionInput>): IProgramSessionInput => ({
    id: '',
    created_at: '',
    segment_id: '',
    name: '',
    classes: [createEmptyClass()],
    ...o,
})

export const createEmptySegment = (o?: Partial<IProgramSegmentInput>): IProgramSegmentInput => ({
    id: '',
    created_at: '',
    program_id: '',
    name: '',
    sessions: [createEmptySession()],
    ...o,
})
