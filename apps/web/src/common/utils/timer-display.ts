import { IEventBlock, IRound } from 'goal-models'

import { IEMOMTimer, ITabataTimer, ITimecapTimer, TTimerTypes } from '@models/time'

export type TSettings = Partial<ITabataTimer & IEMOMTimer & ITimecapTimer>

export type TOpenTimerAllowedTypes = Exclude<TTimerTypes, 'not_timed'>

export const roundTimerSettings = (round: IRound): TSettings => {
    switch (round.type) {
        case 'amrap':
        case 'for_time':
            return {
                numberOfRounds: round.numberOfRounds,
                timecap: round.timecap,
            }
        case 'emom':
            return {
                numberOfRounds: round.numberOfRounds,
                each: round.each,
            }
        case 'tabata':
            return {
                numberOfRounds: round.numberOfRounds,
                work: round.work,
                rest: round.rest,
            }
    }

    return {}
}

export const roundTimerType = (round: IRound): TOpenTimerAllowedTypes | null => {
    switch (round.type) {
        case 'emom':
            if (round.each && round.each > 0 && round.numberOfRounds && round.numberOfRounds > 0) return 'emom'
            break
        case 'tabata':
            if (
                round.work &&
                round.work > 0 &&
                round.rest &&
                round.rest > 0 &&
                round.numberOfRounds &&
                round.numberOfRounds > 0
            )
                return 'tabata'
            break
        case 'for_time':
        case 'amrap':
            if (round.timecap && round.timecap > 0) return 'for_time'
            break
    }
    return null
}

export const blockTimerSettings = (block: IEventBlock): TSettings => {
    switch (block.event_type) {
        case 'amrap':
        case 'max_weight':
        case 'for_time':
            return {
                numberOfRounds: block.numberOfRounds,
                timecap: block.timecap,
            }
        case 'emom':
            return {
                numberOfRounds: block.numberOfRounds,
                each: block.each,
            }
        case 'tabata':
            return {
                numberOfRounds: block.numberOfRounds,
                work: block.work,
                rest: block.rest,
            }
    }

    return {}
}

export const blockTimerType = (block: IEventBlock): TOpenTimerAllowedTypes | null => {
    switch (block.event_type) {
        case 'emom':
            if (block.each && block.each > 0 && block.numberOfRounds && block.numberOfRounds > 0) return 'emom'
            break
        case 'tabata':
            if (
                block.work &&
                block.work > 0 &&
                block.rest &&
                block.rest > 0 &&
                block.numberOfRounds &&
                block.numberOfRounds > 0
            )
                return 'tabata'
            break
        case 'for_time':
        case 'max_weight':
        case 'amrap':
            if (block.timecap && block.timecap > 0) return 'for_time'
            break
    }
    return null
}

export const checkIsTimedWorkout = (block: IEventBlock): boolean => {
    return block.rounds.every((round) => ['for_time', 'emom', 'amrap', 'tabata', 'rest'].includes(round.type))
}
