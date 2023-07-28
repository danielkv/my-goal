import { IEventBlock } from './block'
import { IUserResult } from './result'

export interface IWorkout {
    id: string
    createdBy: string
    createdAt: string
    workout: IEventBlock
    workoutToken: string
    countResults: number
}

export interface IUserWorkoutResult extends IUserResult {
    workoutId: string
}
