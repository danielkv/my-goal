import { Models } from './database.models'

export interface IUserData {
    readonly uid: string
    readonly email?: string
    readonly emailVerified: boolean
    readonly displayName?: string
    readonly photoURL?: string | null
    readonly phoneNumber?: string
}

export interface IUserClaims {
    userrole?: 'default' | 'none'
    claims_admin?: boolean
}

export interface IUserMetadata {
    displayName: string
    photoURL?: string
}

export interface IUserInput extends Omit<IUserMetadata, 'disabled'> {
    email: string
    password: string
    phone?: string | null
}

export interface IUser extends Models<'profiles'> {}

export interface IUserContext extends IUser {
    claims: IUserClaims
}

export interface IAutheticationContext {
    user: IUserContext
    //claims: IUserClaims
}
