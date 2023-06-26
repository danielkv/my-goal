import { IRound } from '@models/block'
import { TMergedTimer } from '@models/time'
import { numberHelper } from '@utils/numbers'

import { BaseDisplay } from './base'
import { MovementDisplay, movementDisplay } from './movement'

export class RoundDisplay extends BaseDisplay {
    private complexSplit = ' + '

    constructor(private movementDisplay: MovementDisplay) {
        super()
    }

    display(round: IRound): string {
        switch (round.type) {
            case 'rest':
                return this.displayRest(round.time)
            case 'complex':
                return this.displayComplex(round)
        }

        return ''
    }

    private displayComplex(obj: IRound): string {
        if (obj.type !== 'complex') return ''

        const complex = obj.movements.map((m) => this.movementDisplay.displayMovement(m)).join(this.complexSplit)
        const weight = this.movementDisplay.displayWeight(obj.movements[0].weight)

        return this.displayArray([complex, weight])
    }

    displayHeader(round: IRound, sequence?: string | null): string {
        if (round.type === 'rest') return ''
        if (round.type === 'complex') return super.displayNumberOfRounds(round.numberOfRounds)

        const _sequence = sequence || numberHelper.findSequenceReps(round.movements)

        return this.displayTimer(round.type, round as TMergedTimer, _sequence) || ''
    }
}

export const roundDisplay = new RoundDisplay(movementDisplay)
