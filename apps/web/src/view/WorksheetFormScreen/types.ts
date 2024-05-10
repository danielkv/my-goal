import { IWorksheetInput } from 'goal-models'

export interface IWorksheetFormBaseProps {
    saveDraft(week: IWorksheetInput | IWorksheetInput<'v2'>, clear?: boolean): void
}
