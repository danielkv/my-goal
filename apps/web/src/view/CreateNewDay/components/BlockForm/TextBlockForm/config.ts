import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { ITextBlock } from '@models/block'
import { createTextBlockValues } from '@utils/worksheetInitials'

export type TRestBlockForm = Omit<ITextBlock, 'type'>

export const textBlockInitialValues: TRestBlockForm = createTextBlockValues()

export const textBlockFormSchema = z.object<ZodShape<TRestBlockForm>>({
    text: z.string({ required_error: 'Texto é obrigatório' }).nonempty('Texto é obrigatório'),
})
