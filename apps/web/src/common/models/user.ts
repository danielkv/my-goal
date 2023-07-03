import { IUserData } from 'goal-models'

export interface IUser extends IUserData {
    readonly customClaims?: {
        [key: string]: any
    }
}

export interface IUserCredential extends Omit<IUser, 'disabled' | 'emailVerified' | 'customClaims'> {}

export interface ListUsersResult {
    users: IUser[]
    pageToken?: string
}
