import { IProgramInput, IProgramSegmentInput, IProgramSessionInput, ModelsInsert } from 'goal-models'
import { z } from 'zod'

export type TProgramForm = IProgramInput

export const programFormSchema = z.object({
    name: z.string({ required_error: 'Nome é obrigatório' }).min(1, { message: 'Nome é obrigatório' }),
    amount: z.number({ invalid_type_error: 'Número inválido', required_error: 'Valor é obrigatório' }),
    block_segments: z.enum(['none', 'weekly', 'monthly']),
    expiration: z.number({ invalid_type_error: 'Número inválido', required_error: 'Expiração é obrigatória' }),
    image: z.instanceof(File, { message: 'Selecione um imagem' }),
    segments: z
        .object({
            name: z.string({ required_error: 'Nome é obrigatório' }).min(1, { message: 'Nome é obrigatório' }),
            sessions: z
                .object({
                    name: z.string({ required_error: 'Nome é obrigatório' }).min(1, { message: 'Nome é obrigatório' }),
                    classes: z
                        .object({
                            name: z
                                .string({ required_error: 'Nome é obrigatório' })
                                .min(1, { message: 'Nome é obrigatório' }),
                            video: z
                                .string({ required_error: 'Vídeo é obrigatório' })
                                .min(1, { message: 'Vídeo é obrigatório' }),
                            text: z
                                .string({ required_error: 'Texto é obrigatório' })
                                .min(1, { message: 'Texto é obrigatório' }),
                        })
                        .array()
                        .nonempty('Insira ao menos 1 classe'),
                })
                .array()
                .nonempty('Insira ao menos 1 sessão'),
        })
        .array()
        .nonempty('Insira ao menos 1 segmento'),

    //.nonempty('Insira ao menos 1 segmento'),
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

export const createEmptyProgram = (o?: Partial<IProgramInput>): IProgramInput => ({
    id: '',
    created_at: '',
    name: '',
    amount: 0,
    expiration: 365,
    block_segments: 'none',
    image: null,
    segments: [createEmptySegment()],
    ...o,
})
