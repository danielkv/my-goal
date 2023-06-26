import { omit } from 'radash'
import { z } from 'zod'

import { IWorksheet } from '@models/day'
import { createWorksheetValues } from '@utils/worksheetInitials'

export type TWorksheetForm = Omit<IWorksheet, 'days' | 'id'>

export const worksheetInitialValues: TWorksheetForm = omit(createWorksheetValues(), ['days'])

export const worksheetFormSchema = z.object({
    name: z.string({ required_error: 'Nome é obrigatório' }).nonempty('Nome é obrigatório'),
    startDate: z.string({ required_error: 'Data de início é obrigatória' }).nonempty('Data de início é obrigatória'),
    info: z.string().optional(),
})
