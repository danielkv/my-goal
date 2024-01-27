import { IBlock, IRound } from './block'
import { Models, ModelsInsert } from './database.models'

export type ISection = {
    name: string
    blocks: IBlock[]
}

export type IPeriod = {
    name?: string
    sections: ISection[]
}

export type IDay = Models<'days'>

export interface IDayInput extends ModelsInsert<'days'> {}

export interface IWorksheet extends Models<'worksheets'> {
    days: IDay[]
}

export interface IWorksheetInput extends ModelsInsert<'worksheets'> {
    days: IDayInput[]
}

export type IDayModel = Models<'days'>

export type TPeaces = IDayInput | IPeriod | ISection | IBlock | IRound

export type IWorksheetModel = IWorksheet
