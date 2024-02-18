import { IDayInput, IWorksheetInput, IWorksheetModel } from 'goal-models'
import { omit } from 'radash'

import { getWorksheetByIdUseCase } from './getWorksheetById'
import { saveWorksheetUseCase } from './saveWorksheet'

export async function duplicateWorksheetUseCase(worksheetId: string): Promise<IWorksheetModel> {
    const worksheet = await getWorksheetByIdUseCase(worksheetId)

    const duplicatedWorksheet: IWorksheetInput = omit(worksheet, ['id'])
    duplicatedWorksheet.published = false
    duplicatedWorksheet.name = `Cópia de ${worksheet.name}`

    if (duplicatedWorksheet.days) {
        duplicatedWorksheet.days = worksheet.days.map<IDayInput>((day) => omit(day, ['id']))
    } else {
        duplicatedWorksheet.days = []
    }

    const result = await saveWorksheetUseCase(duplicatedWorksheet)

    return result
}
