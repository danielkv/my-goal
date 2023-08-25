import { IUserResult, TResultType } from './result'
import { IUserData } from './user'

export interface IMovement {
    id: string
    resultType: TResultType
    movement: string
    countResults: number
}

export interface IUserMovementResult extends IUserResult {
    movementId: string
}

export interface IUserMovementResultResponse extends IUserMovementResult {
    user: IUserData
}

export interface IUserMovementResultListResponse {
    movement: IMovement
    result?: IUserMovementResult
}

export interface IUserMovementResultInput extends Omit<IUserMovementResult, 'id'> {}
