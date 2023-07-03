import { IUserData } from 'goal-models'

export interface IUserInput {
    displayName: string
    phoneNumber: string
    email: string
    password: string
}

export interface IUser extends IUserData {
    socialLogin: boolean
}
