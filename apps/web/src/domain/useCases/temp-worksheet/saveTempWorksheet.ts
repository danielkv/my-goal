import { IWorksheet } from 'goal-models'

import { getTempWorksheetKey } from '@utils/getTempWorksheetKey'

export function saveTempWorksheetUseCase(worksheet: IWorksheet): IWorksheet {
    window.localStorage.setItem(getTempWorksheetKey(worksheet.id), JSON.stringify(worksheet))

    return worksheet
}
