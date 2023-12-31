import { IPeriod } from 'goal-models'
import { omit } from 'radash'
import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { createPeriodValues } from '@utils/worksheetInitials'

export type TPeriodForm = Omit<IPeriod, 'sections'>

export const periodInitialValues: TPeriodForm = omit(createPeriodValues(), ['sections'])

export const periodFormSchema = z.object<ZodShape<TPeriodForm>>({
    name: z.string().optional(),
})
