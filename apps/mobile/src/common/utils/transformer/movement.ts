import { IEventMovement, IMovementWeight, TWeightTypes } from '@models/block'

import { BaseTransformer } from './base'
import { numberHelper } from './numbers'

export class MovementTransformer extends BaseTransformer {
    private repsRegex = this.mergeRegex([
        '(?:((?<reps_number>',
        this.numberRegex,
        ')((?<reps_type>',
        this.repsTypeRegex,
        ')?)+)|max)\\s',
    ])

    private movementRegex = this.mergeRegex([
        '^(?<reps>',
        this.repsRegex,
        ')?(?<name>',
        this.movementNameRegex,
        ')+(?<weight>',
        this.weightRegex,
        ')?',
    ])

    toObject(text: string, roundReps?: string[]): IEventMovement {
        const match = text.match(this.movementRegex)

        if (!match?.groups) return { name: text.trim(), reps: '' }

        const reps = this.extractReps(match.groups.reps, roundReps)
        const weight = this.extractWeight(match.groups.weight)

        return {
            name: match.groups.name.trim(),
            reps,
            weight,
        }
    }

    protected extractWeight(text?: string): IMovementWeight | undefined {
        if (!text) return undefined

        const match = text.match(this.weightRegex)
        if (!match?.groups?.weight) return undefined

        return {
            value: match.groups.weight.trim(),
            type: match.groups.weight_type.trim() as TWeightTypes,
        }
    }

    protected extractReps(text?: string, roundReps?: string[]): string {
        if (roundReps) return roundReps.join('-')

        if (!text) return ''

        const match = text.match(this.repsRegex)
        if (!match?.groups) return text

        const reps = match.groups.reps_number
            ? `${match.groups.reps_number.trim()}${match.groups.reps_type || ''}`
            : match.groups.reps

        return reps
    }

    toString(obj: IEventMovement, hideReps?: boolean): string {
        const weight = this.weightToString(obj.weight)
        const reps = obj.reps && hideReps ? obj.reps.trim() : ''
        return this.displayArray([this.displayArray([reps, obj.name]), weight], ' - ')
    }

    weightToString(weight?: IMovementWeight): string {
        const r = this.displayArray([weight?.value, weight?.type], '')

        return r
    }

    displayWeight(weight?: IMovementWeight): string {
        if (!weight?.value || weight.type === 'none') return ''

        const value = numberHelper.convertNumbers(weight.value, { suffix: '', separator: `${weight.type} ` })

        return this.displayArray([value.trim(), weight.type], '')
    }

    displayMovement(obj: IEventMovement, hideReps?: boolean) {
        const reps = this.displayReps(obj)
        const displayMovement = `${!hideReps ? reps : ''}${obj.name}`

        return displayMovement
    }

    display(obj: IEventMovement, hideReps?: boolean) {
        const weight = this.displayWeight(obj.weight)
        const movement = this.displayMovement(obj, hideReps)

        return this.displayArray([movement, weight], ' - ')
    }

    private displayReps(obj: IEventMovement) {
        const reps = numberHelper.convertNumbers(obj.reps, { suffix: '' })
        const repsDisplay = reps && reps !== '0' ? `${reps} ` : ''
        return repsDisplay
    }
}

export const movementTransformer = new MovementTransformer()
