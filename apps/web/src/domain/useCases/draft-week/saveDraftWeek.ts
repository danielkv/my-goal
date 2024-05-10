import dayjs from 'dayjs'
import { IWorksheetInput } from 'goal-models'

import { getTempWorksheetKey } from '@utils/getTempWorksheetKey'

import { IWorksheetWeekHistory } from './types'

export function saveDraftWeekUseCase(week: IWorksheetInput | IWorksheetInput<'v2'>): void {
    if (!week.id) return

    const expiresAt = dayjs().add(1, 'days').unix()

    const data: IWorksheetWeekHistory = {
        expiresAt,
        week,
    }
    window.localStorage.setItem(getTempWorksheetKey(week.id), JSON.stringify(data))
}
