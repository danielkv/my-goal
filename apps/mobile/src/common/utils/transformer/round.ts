import { IEventMovement, IRound, IRoundEMOM, IRoundTabata, IRoundTimecap } from '@models/block'
import { TTimerTypes } from '@models/time'
import { pluralize } from '@utils/strings'
import { getTimeFromSeconds } from '@utils/time'
import { roundTypes } from '@utils/worksheetInitials'

import cloneDeep from 'clone-deep'

import { BaseTransformer } from './base'
import { MovementTransformer, movementTransformer } from './movement'
import { numberHelper } from './numbers'

type TRoundTypeTransform = 'emom' | 'for time' | 'amrap' | 'tabata'

export class RoundTransformer extends BaseTransformer {
    private breakline = '\n'
    private complexSplit = ' + '

    private movementRegex = this.mergeRegex(['^(?:(?:', this.numberRegex, ')?)+(?<name>', this.movementNameRegex, ')+'])

    private complexRegex = this.mergeRegex(['^(?<movements>', this.movementRegex, ')(?<weight>', this.weightRegex, ')'])
    private titleRegex = this.mergeRegex(
        [
            '^round:',
            '(?:\\s(?<rounds>(',
            this.numberRegex,
            ')+))?',
            '(?:\\s(?<type>',
            this.timerTypeRegex,
            ')(?:\\s(?<time>.*))?)?\n',
        ],
        'im'
    )

    constructor(private movementTransformer: MovementTransformer) {
        super()
    }

    toObject(text: string): IRound | null {
        const match = text.match(this.titleRegex)

        if (match?.groups) {
            const extractedText = text.replace(match[0].replaceAll('\n', ''), '').trim()

            const restRoundTime = this.findRest(text)
            if (restRoundTime) return { type: 'rest', time: restRoundTime, movements: [] }

            const { numberOfRounds, reps } = this.extractRounds(match.groups.rounds)

            const extractedRound = this.textMovementsToRound(extractedText, reps)
            if (!extractedRound) return null

            const type =
                extractedRound.type === 'complex'
                    ? 'complex'
                    : this.tranformType(match.groups.type as TRoundTypeTransform)

            switch (type) {
                case 'tabata': {
                    const [work, rest] = this.extractTimeByType(type, match.groups.time)

                    return {
                        numberOfRounds,
                        work,
                        rest,
                        ...extractedRound,
                        type,
                    }
                }
                case 'emom': {
                    const time = this.extractTimeByType(type, match.groups.time)

                    return {
                        numberOfRounds,
                        each: time,
                        ...extractedRound,
                        type,
                    }
                }
                case 'not_timed':
                case 'complex': {
                    return {
                        numberOfRounds,
                        ...extractedRound,
                        type,
                    }
                }
                default: {
                    const time = this.extractTimeByType(type, match.groups.time)

                    return {
                        numberOfRounds,
                        timecap: time,
                        ...extractedRound,
                        type,
                    }
                }
            }
        }

        const restRoundTime = this.findRest(text)
        if (restRoundTime) return { type: 'rest', time: restRoundTime, movements: [] }

        return this.textMovementsToRound(text)
    }

    private extractRounds(roundsText?: string) {
        if (!roundsText) return { numberOfRounds: 1 }
        if (!Number.isNaN(Number(roundsText))) return { numberOfRounds: Number(roundsText) }

        const match = roundsText.match(numberHelper.sequenceRegex)
        if (!match) return { numberOfRounds: 1 }

        const reps = roundsText.split('-')

        return { numberOfRounds: reps.length, reps }
    }

    toString(obj: IRound): string {
        if (obj.type === 'rest') return this.displayRest(obj.time)

        let title = this.titleToString(obj)

        if (obj.type === 'complex') {
            if (title) return `${title}\n${this.displayComplex(obj)}`
            return this.complexToString(obj)
        }

        const round = cloneDeep(obj)

        const matchingReps = this.findSequenceReps(obj.movements)

        if (matchingReps) title = this.titleToString(obj, matchingReps)

        const movements = round.movements
            .map((o) => this.movementTransformer.toString(o, !matchingReps))
            .join(this.breakline)

        return this.displayArray([title, movements], '\n')
    }

    findSequenceReps(movements: IEventMovement[]): string[] | null {
        const compareReps = movements[0]?.reps
        if (!compareReps) return null

        if (!compareReps.includes('-')) return null

        const match = compareReps.match(numberHelper.sequenceRegex)
        if (!match) return null

        if (movements.length === 1) return compareReps.split('-')

        if (!movements.every((movement) => movement.reps === compareReps)) return null

        return compareReps.split('-')
    }

    private titleToString(obj: IRound, roundReps?: string[]): string | null {
        const rounds = roundReps
            ? roundReps.join('-')
            : obj.numberOfRounds && obj.numberOfRounds > 1
            ? obj.numberOfRounds
            : null

        if (obj.type === 'rest') return null

        if (obj.type === 'complex') {
            const displayRounds = super.displayNumberOfRounds(obj.numberOfRounds, '')
            if (!displayRounds) return null
            return `round: ${displayRounds}`
        }

        const type = this.typeToString(obj.type)
        const timeString = this.roundTimerToString(obj)

        if (!rounds && !type) return null

        return this.displayArray([rounds, type, timeString], ' ', 'round: ')
    }

    private textMovementsToRound(text: string, roundReps?: string[]): IRound | null {
        const textMovements = text.split(this.breakline)
        if (!textMovements.length) return null

        if (textMovements.length === 1) {
            const textToMatch = textMovements[0]
            const match = textToMatch.match(this.complexRegex)

            if (match?.groups?.movements) {
                const complexMovements = match?.groups?.movements.split(this.complexSplit)
                if (complexMovements.length > 1)
                    return {
                        type: 'complex',
                        movements: complexMovements.map((movement) => {
                            const movementText = `${movement}${match.groups?.weight || ''}`

                            return this.movementTransformer.toObject(movementText)
                        }),
                    }
            }
        }

        const movements = textMovements.map((movement) => this.movementTransformer.toObject(movement, roundReps))

        const round: IRound = {
            type: 'not_timed',
            movements,
        }

        if (roundReps) return round

        const sequenceReps = this.findSequenceReps(movements)
        if (sequenceReps) round.numberOfRounds = sequenceReps.length

        return round
    }

    private tranformType(type?: TRoundTypeTransform): TTimerTypes {
        if (!type) return 'not_timed'
        if (type === 'for time') return 'for_time'

        return type
    }

    private typeToString(type: TTimerTypes): TRoundTypeTransform | null {
        if (!type || type === 'not_timed') return null
        if (type === 'for_time') return 'for time'

        return type
    }

    displayRestRound(obj: IRound): string {
        if (obj.type !== 'rest') return ''

        return super.displayRest(obj.time)
    }

    displayComplex(obj: IRound): string {
        if (obj.type !== 'complex') return ''

        const complex = obj.movements.map((m) => this.movementTransformer.displayMovement(m)).join(this.complexSplit)
        const weight = this.movementTransformer.displayWeight(obj.movements[0].weight)

        return this.displayArray([complex, weight], ' - ')
    }

    private complexToString(obj: IRound): string {
        if (obj.type !== 'complex') return ''

        const complex = obj.movements.map((m) => this.movementTransformer.displayMovement(m)).join(this.complexSplit)
        const weight = this.movementTransformer.weightToString(obj.movements[0].weight)

        return this.displayArray([complex, weight], ' - ')
    }

    displayTitle(round: IRound, roundReps?: string | null): string {
        if (round.type === 'rest') return ''
        if (round.type === 'complex') return super.displayNumberOfRounds(round.numberOfRounds)
        const time =
            round.type === 'amrap' || round.type === 'for_time' || round.type === 'emom' || round.type === 'tabata'
                ? this.displayRoundTimer(round) || ''
                : ''

        const numberOfRounds = roundReps ? roundReps : !time ? super.displayNumberOfRounds(round.numberOfRounds) : ''

        const type = round.type && round.type != 'not_timed' ? roundTypes[round.type] : ''

        return this.displayArray([numberOfRounds, type, time])
    }

    displayShortTitle(round: IRound): string {
        if (round.type === 'rest') return ''
        if (round.type === 'complex') return ''

        if (round.type === 'emom') {
            const roundsText = pluralize(round.numberOfRounds, 'round')
            if (round.each > 60 && round.each % 60 === 0)
                return `E${round.each / 60}M ${round.numberOfRounds} ${roundsText}`
            const each = getTimeFromSeconds(round.each)
            return `EMOM ${round.numberOfRounds}x ${each}`
        }

        const time =
            round.type === 'amrap' || round.type === 'for_time' || round.type === 'tabata'
                ? this.displayShortRoundTimer(round) || ''
                : ''

        const type = round.type && round.type != 'not_timed' ? roundTypes[round.type] : ''

        return this.displayArray([type, time])
    }

    private roundTimerToString(obj: IRound): string | null {
        switch (obj.type) {
            case 'tabata':
                return super.timerToString('tabata', obj.work, obj.rest)

            case 'emom':
                return super.timerToString('emom', obj.each)

            case 'for_time':
            case 'amrap':
                return super.timerToString('emom', obj.timecap)

            default:
                return super.timerToString('not_timed')
        }
    }

    private displayRoundTimer(round: IRoundTimecap | IRoundEMOM | IRoundTabata): string {
        switch (round.type) {
            case 'emom':
                return super.displayTimer('emom', round.numberOfRounds, round.each)
            case 'tabata':
                return super.displayTimer('tabata', round.numberOfRounds, round.work, round.rest)
            default:
                return super.displayTimer(round.type, round.numberOfRounds, round.timecap)
        }
    }

    private displayShortRoundTimer(round: IRoundTimecap | IRoundEMOM | IRoundTabata): string {
        switch (round.type) {
            case 'emom':
                return super.displayShortTimer('emom', round.numberOfRounds, round.each)
            case 'tabata':
                return super.displayShortTimer('tabata', round.numberOfRounds, round.work, round.rest)
            default:
                return super.displayShortTimer(round.type, round.numberOfRounds, round.timecap)
        }
    }
}

export const roundTransformer = new RoundTransformer(movementTransformer)
