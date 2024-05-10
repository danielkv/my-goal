import { ITextBlock } from 'goal-models'
import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { createTextBlockValues } from '@utils/worksheetInitials'

export type TRestBlockForm = Omit<ITextBlock, 'type'>

export const textBlockInitialValues: TRestBlockForm = createTextBlockValues()

export const textBlockFormSchema = z.object<ZodShape<TRestBlockForm>>({
    text: z.string({ required_error: 'Texto é obrigatório' }).nonempty('Texto é obrigatório'),
})
