import { getTempWorksheetKey } from '@utils/getTempWorksheetKey'

export function removeTempWorksheetUseCase(worksheetId: string): void {
    window.localStorage.removeItem(getTempWorksheetKey(worksheetId))
}
