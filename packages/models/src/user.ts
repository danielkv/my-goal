import { Models } from './database.models'

export interface IUserClaims {
    userrole?: 'default' | 'none'
    claims_admin?: boolean
}

export interface IUser extends Models<'profiles'> {}

export interface IUserInput extends IUser {
    password: string
    phone?: string | null
}

export interface IUserData extends IUser {
    phone?: string | null
}

export interface IUserContext extends IUser {
    claims: IUserClaims
}
