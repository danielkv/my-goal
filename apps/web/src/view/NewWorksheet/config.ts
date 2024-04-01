import { IBlockV2, IDayInput, IPeriod, ISection, IWorksheetInput } from 'goal-models'

export function createEmptyBlockV2(o?: Partial<Omit<IBlockV2, 'v2'>>): IBlockV2 {
    return {
        v2: true,
        text: '',
        ...o,
    }
}

export function createEmptySection(o?: Partial<ISection<'v2'>>): ISection<'v2'> {
    return {
        blocks: [createEmptyBlockV2()],
        name: '',
        ...o,
    }
}

export function createEmptyPeriod(o?: Partial<IPeriod<'v2'>>): IPeriod<'v2'> {
    return {
        sections: [createEmptySection()],
        name: '',
        ...o,
    }
}

export function createEmptyDay(o?: Partial<IDayInput<'v2'>>): IDayInput<'v2'> {
    return {
        periods: [createEmptyPeriod()],
        date: '',
        name: '',
        worksheetId: '',
        ...o,
    }
}

export function createEmptyWorksheet(o?: Partial<IWorksheetInput<'v2'>>): IWorksheetInput<'v2'> {
    return {
        days: [createEmptyDay()],
        startDate: '',
        endDate: '',
        name: '',
        published: false,
        ...o,
    }
}
