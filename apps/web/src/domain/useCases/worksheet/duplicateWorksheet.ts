import { omit } from 'radash'

import { IDay, IWorksheet, IWorksheetModel } from '@models/day'

import { getWorksheetByIdUseCase } from './getWorksheetById'
import { saveWorksheetUseCase } from './saveWorksheet'

export async function duplicateWorksheetUseCase(worksheetId: string): Promise<IWorksheetModel> {
    const worksheet = await getWorksheetByIdUseCase(worksheetId)

    const duplicatedWorksheet: IWorksheet = omit(worksheet, ['id'])
    duplicatedWorksheet.published = false
    duplicatedWorksheet.name = `Cópia de ${worksheet.name}`

    if (duplicatedWorksheet.days) {
        duplicatedWorksheet.days = worksheet.days.map<IDay>((day) => omit(day, ['id']))
    } else {
        duplicatedWorksheet.days = []
    }

    const result = await saveWorksheetUseCase(duplicatedWorksheet)

    return result
}
