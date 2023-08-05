import { IEventBlock } from './block'
import { IUserResult } from './result'

// export interface IWorkout {
//     id: string
//     createdBy: string
//     createdAt: string
//     workout: IEventBlock
//     workoutToken: string
//     countResults: number
// }

export interface IUserWorkoutResult extends IUserResult {
    workoutSignature: string
    workout: IEventBlock
}

export interface IUserWorkoutResultInput extends Omit<IUserResult, 'id'> {
    workoutSignature: string
    workout: IEventBlock
}
