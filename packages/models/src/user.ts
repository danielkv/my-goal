import { Models } from './database.models'

export interface IUserClaims {
    claims_admin?: boolean
}

export interface IUser extends Models<'profiles'> {
    email: string
}

export interface IUserInput extends IUser {
    password: string
    phone?: string | null
}

export interface IUserData extends IUser {
    phone?: string | null
}

export interface IUserContext extends IUserData {
    claims: IUserClaims
}

export interface IUserListItem extends Models<'users'> {}

export type SocialLoginProvider = 'google' | 'apple'
