import { Models } from './database.models'

export type TResultType = 'time' | 'reps' | 'weight'

export interface IWorkoutResult {
    type: TResultType
    value: number
}

export interface IUserResult extends Models<'movement_results'> {}

export interface IUserHighestResult extends Models<'highest_movement_results'> {}
