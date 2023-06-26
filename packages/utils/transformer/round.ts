import cloneDeep from 'clone-deep'
import { omit } from 'radash'

import { IRound } from '@models/block'
import { TMergedTimer } from '@models/time'
import { getTimeFromSeconds } from '@utils/time'

import { numberHelper } from '../numbers'

import { BaseTransformer } from './base'
import { MovementTransformer, movementTransformer } from './movement'

export class RoundTransformer extends BaseTransformer {
    private breakline = '\n'
    private complexSplit = ' + '

    constructor(private movementTransformer: MovementTransformer) {
        super()
    }

    toObject(text: string, numberOfRounds?: number): IRound | null {
        const textMovements = this.breakTextInMovements(text)
        if (!textMovements) return null

        const extractedHeader = this.extractTimerFromString(textMovements[0].trim())
        const finalNumberOfRounds = numberOfRounds || extractedHeader?.numberOfRounds || 1

        if (extractedHeader) {
            textMovements.splice(0, 1)

            const restRoundTime = this.findRest(text)
            if (restRoundTime) return { type: 'rest', time: restRoundTime, movements: [] }

            const extractedRound = this.textMovementsToRound(textMovements, extractedHeader.reps)
            if (!extractedRound) return null
            return {
                ...omit(extractedHeader, ['reps', 'numberOfRounds']),
                numberOfRounds: finalNumberOfRounds,
                ...extractedRound,
                type: extractedRound.type === 'complex' ? 'complex' : extractedHeader.type,
            } as IRound
        }

        const restRoundTime = this.findRest(text)
        if (restRoundTime) return { type: 'rest', time: restRoundTime, movements: [] }

        const round = this.textMovementsToRound(textMovements)
        if (!round) return null

        return {
            ...round,
            numberOfRounds: finalNumberOfRounds,
        }
    }

    toString(obj: IRound): string {
        if (obj.type === 'rest') return `${getTimeFromSeconds(obj.time)} Rest`

        const matchingReps = numberHelper.findSequenceReps(obj.movements)

        const title = this.headerToString(obj, matchingReps)

        if (obj.type === 'complex') {
            if (title) return `${title}\n${this.complexToString(obj, !!matchingReps)}`
            return this.complexToString(obj)
        }

        const round = cloneDeep(obj)

        const movements = round.movements
            .map((o) => this.movementTransformer.toString(o, !!matchingReps))
            .join(this.breakline)

        return this.arrayToString([title, movements], '\n')
    }

    private headerToString(obj: IRound, sequence?: string | null): string | null {
        if (obj.type === 'rest') return null

        if (obj.type === 'complex') {
            if (sequence) return sequence

            const rounds = super.roundsToString(obj.numberOfRounds)

            return rounds
        }

        return this.timerToString(obj.type, obj as TMergedTimer, sequence)
    }

    private breakTextInMovements(text: string): string[] | null {
        const textMovements = text.split(this.breakline)
        if (!textMovements.length) return null

        return textMovements
    }

    private textMovementsToRound(textMovements: string[], roundReps?: string): IRound | null {
        if (textMovements.length === 1) {
            const match = textMovements[0].trim().match(this.weightBaseRegex)
            const complexMovementsText = match?.groups?.movement || textMovements[0].trim()

            const complexMovements = complexMovementsText.split(this.complexSplit)
            const weightText = match?.groups?.weight ? ` ${match.groups.weight.trim()}` : ''

            if (complexMovements.length > 1) {
                return {
                    type: 'complex',
                    movements: complexMovements.map((movement) => {
                        const movementText = `${movement.trim()}${weightText}`

                        return this.movementTransformer.toObject(movementText, roundReps)
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

        const sequenceReps = numberHelper.findSequenceReps(movements)
        if (sequenceReps) round.numberOfRounds = sequenceReps.length

        return round
    }

    private complexToString(obj: IRound, hideReps?: boolean): string {
        if (obj.type !== 'complex') return ''

        const complex = obj.movements
            .map((m) => this.movementTransformer.movementToString(m, hideReps))
            .join(this.complexSplit)
        const weight = this.movementTransformer.weightToString(obj.movements[0].weight)

        return this.arrayToString([complex, weight])
    }
}

export const roundTransformer = new RoundTransformer(movementTransformer)
