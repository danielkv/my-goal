import { Models, ModelsInsert } from './database.models'
import { IUser } from './user'

export interface IUserWorkoutResult extends Models<'workout_results'> {}

export interface IUserWorkoutResultResponse extends IUserWorkoutResult {
    user: IUser
}

export interface IUserWorkoutResultInput extends ModelsInsert<'workout_results'> {}
