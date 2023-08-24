import { IUserResult } from './result'
import { IUserData } from './user'

export interface IMovement {
    id: string
    movement: string
    countResults: number
}

export interface IUserMovementResult extends IUserResult {
    movementId: string
}

export interface IUserMovementResultResponse extends IUserMovementResult {
    movement: string
    user: IUserData
}

export interface IUserMovementResultListResponse {
    movement: IMovement
    result?: IUserMovementResult
}
