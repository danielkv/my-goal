import { IBlock, IDayInput, IWorksheetInput } from 'goal-models'
import { IDay, IPeriod, ISection } from 'goal-models'

export function isDayV2(obj: any): obj is IDay<'v2'> {
    if (!obj?.hasOwnProperty('name') || !obj.hasOwnProperty('date') || !obj.hasOwnProperty('periods')) return false
    if (!Array.isArray(obj.periods) || !obj.periods.every((period: any) => isPeriodV2(period))) return false
    return true
}

export function isPeriodV2(obj: any): obj is IPeriod<'v2'> {
    if (!obj?.hasOwnProperty('sections')) return false
    if (!Array.isArray(obj.sections) || !obj.sections.every(isSectionV2)) return false
    return true
}

export function isSectionV2(obj: Record<string, any>): obj is ISection<'v2'> {
    if (!obj?.hasOwnProperty('name') || !obj.hasOwnProperty('blocks')) return false
    if (!Array.isArray(obj.blocks) || !obj.blocks.every(isBlockV2)) return false
    return true
}

export function isBlockV2(obj: Record<string, any>): obj is IBlock<'v2'> {
    if (obj?.v2 !== true || !obj.hasOwnProperty('text')) return false
    return true
}

export function isWorksheetInputV2(obj: any): obj is IWorksheetInput<'v2'> {
    if (obj?.version !== 'v2' || !obj?.days.every(isDayInputV2)) return false

    return true
}

export function isDayInputV2(obj: any): obj is IDayInput {
    if (!obj?.hasOwnProperty('name') || !obj.hasOwnProperty('date') || !obj.hasOwnProperty('periods')) return false
    if (!Array.isArray(obj.periods) || !obj.periods.every((period: any) => isPeriodV2(period))) return false
    return true
}
