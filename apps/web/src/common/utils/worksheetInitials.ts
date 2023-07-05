import {
    IBlock,
    IDay,
    IEventBlock,
    IEventMovement,
    IMovementWeight,
    IPeriod,
    IRestBlock,
    IRound,
    ISection,
    ITextBlock,
    IWorksheet,
} from 'goal-models'

export function createMovementWeightValues(): IMovementWeight {
    return {
        type: 'kg',
        value: '',
    }
}

export function createRoundMovementValues(): IEventMovement {
    return {
        name: '',
        reps: '',
    }
}
export function createEventRoundValues(): IRound {
    return {
        config: { type: 'not_timed', numberOfRounds: 1 },
        movements: [],
    }
}

export function createEventBlockValues(): IEventBlock {
    return {
        type: 'event',
        config: {
            type: 'not_timed',
            numberOfRounds: 1,
        },
        name: '',
        rounds: [],
    }
}

export function createRestBlockValues(): IRestBlock {
    return {
        type: 'rest',
        time: 120,
    }
}

export function createTextBlockValues(): ITextBlock {
    return {
        type: 'text',
        text: '',
    }
}

export function createBlockValues(): IBlock {
    return { type: '', info: '' }
}

export function createSectionValues(): ISection {
    return { name: '', blocks: [] }
}

export function createPeriodValues(): IPeriod {
    return {
        name: '',
        sections: [],
    }
}

export function createDayValues(): IDay {
    return {
        name: '',
        date: '',
        periods: [],
    }
}

export function createWorksheetValues(): IWorksheet {
    return {
        name: '',
        startDate: '',
        days: [],
    }
}
