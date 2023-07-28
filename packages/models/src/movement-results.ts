import { IUserResult } from './result'

export interface IMovement {
    id: string
    movement: string
    countResults: number
}

export interface IUserMovementResult extends IUserResult {
    movementId: string
}
