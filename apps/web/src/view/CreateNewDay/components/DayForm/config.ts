import { IDayInput } from 'goal-models'
import { omit } from 'radash'
import { z } from 'zod'

import { createDayValues } from '@utils/worksheetInitials'

export type TDayForm = Omit<IDayInput, 'periods'>

export const dayForemInitialValues: TDayForm = omit(createDayValues(), ['periods'])

export const dayFormSchema = z.object({
    name: z.string({ required_error: 'Nome é obrigatório' }).optional().nullable(),
    date: z
        .string({ required_error: 'Data é obrigatória' })
        .nonempty('Data é obrigatória')
        .regex(/^(\d{4}-\d{2}-\d{2})?$/, { message: 'Data inválida' }),
})
