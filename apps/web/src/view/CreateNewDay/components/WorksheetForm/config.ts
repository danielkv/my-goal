import { IWorksheetInput } from 'goal-models'
import { omit } from 'radash'
import { z } from 'zod'

import { createWorksheetValues } from '@utils/worksheetInitials'

export type TWorksheetForm = Omit<IWorksheetInput, 'days'>

export const worksheetInitialValues: TWorksheetForm = omit(createWorksheetValues(), ['days'])

export const worksheetFormSchema = z.object({
    name: z.string({ required_error: 'Nome é obrigatório' }).min(1, 'Nome é obrigatório'),
    startDate: z.string({ required_error: 'Data de início é obrigatória' }).min(1, 'Data de início é obrigatória'),
    // info: z.string().nullable(),
})
