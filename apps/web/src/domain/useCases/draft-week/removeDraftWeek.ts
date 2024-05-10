import { getTempWorksheetKey } from '@utils/getTempWorksheetKey'

export function removeDraftWeekUseCase(weekId: string): void {
    window.localStorage.removeItem(getTempWorksheetKey(weekId))
}
