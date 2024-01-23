import { Tables, TablesInsert } from '../database.types'
import { IBlock, IRound } from './block'

export type ISection = {
    name: string
    blocks: IBlock[]
}

export type IPeriod = {
    name?: string
    sections: ISection[]
}

export type IDay = {
    id?: string
    name: string
    date: string // YYYY-MM-DD
    periods: IPeriod[]
}

type IStartEndDate = {
    start: string
    end: string
}

export type IWorksheet = TablesInsert<'worksheets'> & {
    isCurrent?: boolean
}

export type IDayModel = IDay & { id: string }

export type TPeaces = IDay | IPeriod | ISection | IBlock | IRound

export type IWorksheetModel = Omit<IWorksheet, 'id' | 'days'> & {
    id: string
    days: IDayModel[]
    startEndDate: IStartEndDate
}
