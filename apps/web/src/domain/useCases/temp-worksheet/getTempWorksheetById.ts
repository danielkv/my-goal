import { IWorksheet } from 'goal-models'

import { getTempWorksheetKey } from '@utils/getTempWorksheetKey'

export function getTempWorksheetByIdUseCase(worksheetId: string): IWorksheet | null {
    const data = window.localStorage.getItem(getTempWorksheetKey(worksheetId))

    if (!data) return null

    try {
        return JSON.parse(data) as IWorksheet
    } catch (err) {
        return null
    }
}
