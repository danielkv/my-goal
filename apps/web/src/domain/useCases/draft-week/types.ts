import { IWorksheetInput } from 'goal-models'

export interface IWorksheetWeekHistory {
    expiresAt: number
    week: IWorksheetInput | IWorksheetInput<'v2'>
}
