import { IBlock, IComplexRound, IEventBlock, IRestBlock, IRestRound, IRound, ITextBlock } from 'goal-models'
import { IDay, IDayModel, IPeriod, ISection, IWorksheet, IWorksheetModel } from 'goal-models'

export function isDay(obj: Record<string, any>): obj is IDay {
    if (obj?.hasOwnProperty('name') && obj.hasOwnProperty('date') && obj.hasOwnProperty('periods')) return true
    return false
}

export function isPeriod(obj: Record<string, any>): obj is IPeriod {
    if (obj?.hasOwnProperty('sections')) return true
    return false
}

export function isSection(obj: Record<string, any>): obj is ISection {
    if (obj?.hasOwnProperty('name') && obj.hasOwnProperty('blocks')) return true
    return false
}

export function isBlock(obj: Record<string, any>): obj is IBlock {
    if (obj?.hasOwnProperty('type') && ['event', 'rest', 'text', ''].includes(obj.type)) return true
    return false
}

export function isRestRound(obj: Record<string, any>): obj is IRestRound {
    if (obj.type === 'rest' && obj.hasOwnProperty('time')) return true

    return false
}

export function isComplexRound(obj: Record<string, any>): obj is IComplexRound {
    if (obj.type === 'complex' && obj.hasOwnProperty('movements') && obj.hasOwnProperty('config')) return true

    return false
}

export function isRound(obj: Record<string, any>): obj is IRound {
    if (isRestRound(obj)) return true
    if (isComplexRound(obj)) return true
    if (obj.hasOwnProperty('movements') && obj.hasOwnProperty('config')) return true
    return false
}

export function isEventBlock(obj: Record<string, any>): obj is IEventBlock {
    if (obj?.hasOwnProperty('type') && obj.type === 'event') return true
    return false
}
export function isTextBlock(obj: Record<string, any>): obj is ITextBlock {
    if (obj?.hasOwnProperty('type') && obj.type === 'text') return true
    return false
}
export function isRestBlock(obj: Record<string, any>): obj is IRestBlock {
    if (obj?.hasOwnProperty('type') && obj.type === 'rest') return true
    return false
}

export function isWorksheetModel(obj: IWorksheet): obj is IWorksheetModel {
    if (!obj.id) return false
    if (!obj.days.every(isDayModel)) return false

    return true
}

export function isDayModel(obj: IDay): obj is IDayModel {
    if (obj.id) return true
    return false
}
