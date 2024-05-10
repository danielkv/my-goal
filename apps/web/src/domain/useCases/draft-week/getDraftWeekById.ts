import dayjs from 'dayjs'
import { IWorksheetInput } from 'goal-models'

import { getTempWorksheetKey } from '@utils/getTempWorksheetKey'

import { removeDraftWeekUseCase } from './removeDraftWeek'
import { IWorksheetWeekHistory } from './types'

export function getDraftWeekByIdUseCase(weekId: string): IWorksheetInput | IWorksheetInput<'v2'> | null {
    const data = window.localStorage.getItem(getTempWorksheetKey(weekId))

    if (!data) return null

    try {
        const parsed = JSON.parse(data) as IWorksheetWeekHistory

        if (dayjs().isAfter(parsed.expiresAt)) {
            removeDraftWeekUseCase(weekId)
            return null
        }

        return parsed.week
    } catch (err) {
        return null
    }
}
