import { Models, ModelsInsert } from './database.models'
import { IUserHighestResult } from './result'
import { IUser } from './user'

export interface IMovementInput extends ModelsInsert<'movements'> {}

export interface IMovement extends Models<'movements'> {}

export interface IUserMovementResult extends Models<'movement_results'> {}

export interface IUserMovementResultResponse extends IUserMovementResult {
    user: IUser
}

export interface IUserMovementResultListResponse {
    movement: Models<'movements'>
    result?: IUserHighestResult
}

export interface IUserMovementResultInput extends ModelsInsert<'movement_results'> {}
