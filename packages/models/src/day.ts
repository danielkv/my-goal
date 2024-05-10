import { IBlock, IRound } from './block'
import { Models, ModelsInsert } from './database.models'

export type ISection<Version extends 'v1' | 'v2' = 'v1'> = {
    name: string
    blocks: IBlock<Version>[]
}

export type IPeriod<Version extends 'v1' | 'v2' = 'v1'> = {
    name?: string
    sections: ISection<Version>[]
}

export interface IDay<Version extends 'v1' | 'v2' = 'v1'> extends Omit<Models<'days'>, 'periods'> {
    periods: IPeriod<Version>[]
}

export interface IDayInput<Version extends 'v1' | 'v2' = 'v1'> extends Omit<ModelsInsert<'days'>, 'periods'> {
    periods: IPeriod<Version>[]
}

export interface IWorksheet<Version extends 'v1' | 'v2' = 'v1'> extends Models<'worksheet_weeks'> {
    days: IDay<Version>[]
}

export interface IWorksheetInput<Version extends 'v1' | 'v2' = 'v1'> extends ModelsInsert<'worksheet_weeks'> {
    days: IDayInput<Version>[]
}

export type IDayModel = Models<'days'>

export type TPeaces = IDayInput | IPeriod | ISection | IBlock | IRound

export type IWorksheetModel = IWorksheet
