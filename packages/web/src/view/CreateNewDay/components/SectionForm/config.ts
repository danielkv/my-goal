import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { ISection } from '@models/day'
import { createSectionValues } from '@utils/worksheetInitials'

export type TSectionForm = Omit<ISection, 'blocks'>

export const sectionInitialValues: TSectionForm = createSectionValues()

export const sectionFormSchema = z.object<ZodShape<TSectionForm>>({
    name: z.string({ required_error: 'Nome é obrigatório' }).nonempty('Nome é obrigatório'),
})
