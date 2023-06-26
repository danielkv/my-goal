import { z } from 'zod'

import { IBlock, TBlockType } from '@models/block'
import { createBlockValues } from '@utils/worksheetInitials'

import { eventBlockFormSchema } from './EventBlockForm/config'
import { restBlockFormSchema } from './RestBlockForm/config'
import { textBlockFormSchema } from './TextBlockForm/config'

export type TBlockForm = IBlock

export const blockInitialValues: TBlockForm = createBlockValues()

export const blockTypes: { key: TBlockType; label: string }[] = [
    { key: '', label: '' },
    { key: 'event', label: 'Evento / Exercício' },
    { key: 'rest', label: 'REST' },
    { key: 'text', label: 'Texto' },
]

export const blockFormSchema = z.union([
    z.object({
        type: z.enum(['']),
        info: z.optional(z.string()),
    }),
    eventBlockFormSchema,
    textBlockFormSchema,
    restBlockFormSchema,
])
