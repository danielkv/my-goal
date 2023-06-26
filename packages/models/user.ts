export interface IUser {
    readonly uid: string
    readonly email?: string
    readonly emailVerified: boolean
    readonly displayName?: string
    readonly photoURL?: string
    readonly phoneNumber?: string
    readonly disabled: boolean
    readonly customClaims?: {
        [key: string]: any
    }
}

export interface IUserCredential extends Omit<IUser, 'disabled' | 'emailVerified' | 'customClaims'> {}

export interface ListUsersResult {
    users: IUser[]
    pageToken?: string
}
