import { IUserData } from 'goal-models'

export interface IUserInput {
    displayName: string
    phone: string
    email: string
    password: string
}

export interface IUserFB extends IUserData {
    socialLogin: boolean
}
