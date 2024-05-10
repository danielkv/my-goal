import { IDayInput, IWorksheetInput, IWorksheetModel } from 'goal-models'
import { omit } from 'radash'

import { getWorksheetWeekByIdUseCase } from './getWorksheetWeekById'
import { saveWorksheetWeekUseCase } from './saveWorksheet'

export async function duplicateWeekUseCase(weekId: string): Promise<IWorksheetModel> {
    const week = await getWorksheetWeekByIdUseCase(weekId)

    const duplicatedWeek: IWorksheetInput = omit(week, ['id'])
    duplicatedWeek.published = false
    duplicatedWeek.name = `Cópia de ${week.name}`

    if (duplicatedWeek.days) {
        duplicatedWeek.days = week.days.map<IDayInput>((day) => omit(day, ['id']))
    } else {
        duplicatedWeek.days = []
    }

    const result = await saveWorksheetWeekUseCase(duplicatedWeek)

    return result
}
