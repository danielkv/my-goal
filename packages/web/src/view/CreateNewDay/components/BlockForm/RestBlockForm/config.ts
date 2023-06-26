import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { IRestBlock } from '@models/block'
import { createRestBlockValues } from '@utils/worksheetInitials'

export type TRestBlockForm = Omit<IRestBlock, 'type'>

export const restBlockInitialValues: TRestBlockForm = createRestBlockValues()

export const restBlockFormSchema = z.object<ZodShape<TRestBlockForm>>({
    time: z.number({ invalid_type_error: 'Tempo inválido' }),
    text: z.string().optional(),
})
