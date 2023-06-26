import { IEventMovement, IMovementWeight } from '@models/block'
import { numberHelper } from '@utils/numbers'

import { BaseDisplay } from './base'

export class MovementDisplay extends BaseDisplay {
    displayWeight(weight?: IMovementWeight): string {
        if (!weight?.value || weight.type === 'none') return ''

        const value = numberHelper.convertNumbers(weight.value, { suffix: '', separator: `${weight.type} ` })

        return this.displayArray([value.trim(), weight.type], '')
    }

    displayMovement(obj: IEventMovement, hideReps?: boolean) {
        const reps = hideReps ? null : obj.reps

        return this.displayArray([reps, obj.name])
    }

    display(obj: IEventMovement, hideReps?: boolean) {
        const weight = this.displayWeight(obj.weight)
        const movement = this.displayMovement(obj, hideReps)

        return this.displayArray([movement, weight])
    }
}

export const movementDisplay = new MovementDisplay()
