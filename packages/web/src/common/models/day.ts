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

export type IWorksheet = {
    id?: string
    name: string
    info?: string
    startDate: string // YYYY-MM-DD
    days: IDay[]
    published?: boolean
    isCurrent?: boolean
    startEndDate?: IStartEndDate
}

export type IDayModel = IDay & { id: string }

export type TPeaces = IDay | IPeriod | ISection | IBlock | IRound

export type IWorksheetModel = Omit<IWorksheet, 'id' | 'days'> & {
    id: string
    days: IDayModel[]
    startEndDate: IStartEndDate
}
