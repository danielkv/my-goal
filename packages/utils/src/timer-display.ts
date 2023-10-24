import { isRestRound } from './models'
import { IEventBlock, IRestRound, IRound, TTimerSettings, TTimerTypes } from 'goal-models'

export type TOpenTimerAllowedTypes = Exclude<TTimerTypes, 'not_timed'>

export const roundTimerSettings = (round: IRound): TTimerSettings => {
    if (isRestRound(round)) return {}

    switch (round.config.type) {
        case 'amrap':
        case 'for_time':
            return {
                numberOfRounds: round.config.numberOfRounds,
                timecap: round.config.timecap,
            }
        case 'emom':
            return {
                numberOfRounds: round.config.numberOfRounds,
                each: round.config.each,
            }
        case 'tabata':
            return {
                numberOfRounds: round.config.numberOfRounds,
                work: round.config.work,
                rest: round.config.rest,
            }
    }

    return {}
}

export const roundTimerType = (round: IRound): TOpenTimerAllowedTypes | null => {
    if (isRestRound(round)) return null

    switch (round.config.type) {
        case 'emom':
            if (
                round.config.each &&
                round.config.each > 0 &&
                round.config.numberOfRounds &&
                round.config.numberOfRounds > 0
            )
                return 'emom'
            break
        case 'tabata':
            if (
                round.config.work &&
                round.config.work > 0 &&
                round.config.rest &&
                round.config.rest > 0 &&
                round.config.numberOfRounds &&
                round.config.numberOfRounds > 0
            )
                return 'tabata'
            break
        case 'for_time':
        case 'amrap':
            if (round.config.timecap && round.config.timecap > 0) return 'for_time'
            break
    }

    return null
}

export const blockTimerSettings = ({ config }: IEventBlock): TTimerSettings => {
    switch (config.type) {
        case 'amrap':
        case 'for_time':
            return {
                numberOfRounds: config.numberOfRounds,
                timecap: config.timecap,
            }
        case 'emom':
            return {
                numberOfRounds: config.numberOfRounds,
                each: config.each,
            }
        case 'tabata':
            return {
                numberOfRounds: config.numberOfRounds,
                work: config.work,
                rest: config.rest,
            }
    }

    return {}
}

export const blockTimerType = ({ config }: IEventBlock): TOpenTimerAllowedTypes | null => {
    switch (config.type) {
        case 'emom':
            if (config.each && config.each > 0 && config.numberOfRounds && config.numberOfRounds > 0) return 'emom'
            break
        case 'tabata':
            if (
                config.work &&
                config.work > 0 &&
                config.rest &&
                config.rest > 0 &&
                config.numberOfRounds &&
                config.numberOfRounds > 0
            )
                return 'tabata'
            break
        case 'for_time':
        case 'amrap':
            if (config.timecap && config.timecap > 0) return 'for_time'
            break
    }
    return null
}

export type TTimedMode = 'none' | 'round' | 'block'

export function isValidTimedRound(round: Exclude<IRound, IRestRound>): boolean {
    if (!['for_time', 'emom', 'amrap', 'tabata'].includes(round.config.type)) return false

    if (round.config.type === 'for_time' && !round.config.timecap) return false

    return true
}

export const checkIsTimedWorkout = (block: IEventBlock): TTimedMode => {
    const isNoneMode = block.rounds.every((round) => !isRestRound(round) && !isValidTimedRound(round))
    if (isNoneMode) return 'none'

    const isBlockMode =
        block.rounds.length > 1 && block.rounds.every((round) => isRestRound(round) || isValidTimedRound(round))

    if (!block.rounds.some((round) => !isRestRound(round) && isValidTimedRound(round))) return 'none'

    if (isBlockMode) return 'block'

    return 'round'
}
