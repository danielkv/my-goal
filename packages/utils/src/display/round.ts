import { isComplexRound, isRestRound } from '../models'
import { numberHelper } from '../numbers'
import { BaseDisplay } from './base'
import { MovementDisplay, movementDisplay } from './movement'
import { IRound } from 'goal-models'

export class RoundDisplay extends BaseDisplay {
    private complexSplit = ' + '

    constructor(private movementDisplay: MovementDisplay) {
        super()
    }

    display(round: IRound): string {
        if (isRestRound(round)) return this.displayRest(round.time)
        if (isComplexRound(round)) return this.displayComplex(round)

        return ''
    }

    private displayComplex(obj: IRound): string {
        if (obj.type !== 'complex') return ''

        const complex = obj.movements.map((m) => this.movementDisplay.displayMovement(m)).join(this.complexSplit)
        const weight = this.movementDisplay.displayWeight(obj.movements[0].weight)

        return this.displayArray([complex, weight])
    }

    displayHeader(round: IRound, sequence?: string | null): string {
        if (isRestRound(round)) return this.displayRest(round.time)

        const _sequence = sequence || numberHelper.findSequenceReps(round.movements)

        return this.displayTimer(round.config, _sequence) || ''
    }
}

export const roundDisplay = new RoundDisplay(movementDisplay)
