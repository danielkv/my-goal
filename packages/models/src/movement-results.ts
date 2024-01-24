import { Models, ModelsInsert } from './database.models'
import { IUserHighestResult, TResultType } from './result'
import { IUser } from './user'

export interface IMovementInput {
    resultType: TResultType
    movement: string
}

export interface IMovement extends IMovementInput {
    id: string
    movement_insensitive: string
    countResults: number
}

export interface IUserMovementResult extends Models<'movement_results'> {}

export interface IUserMovementResultResponse extends IUserMovementResult {
    user: IUser
}

export interface IUserMovementResultListResponse {
    movement: Models<'movements'>
    result?: IUserHighestResult
}

export interface IUserMovementResultInput extends ModelsInsert<'movement_results'> {}
