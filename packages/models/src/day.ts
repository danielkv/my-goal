import { IBlock, IRound } from './block'
import { Models } from './database.models'

export type ISection = {
    name: string
    blocks: IBlock[]
}

export type IPeriod = {
    name?: string
    sections: ISection[]
}

export type IDay = Models<'days'>

export type IWorksheet = Models<'worksheets'> & { days: Models<'days'>[] }

export type IDayModel = Models<'days'>

export type TPeaces = IDay | IPeriod | ISection | IBlock | IRound

export type IWorksheetModel = IWorksheet
