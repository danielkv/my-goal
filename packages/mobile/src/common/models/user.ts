export interface IUserInput {
    displayName: string
    phoneNumber: string
    email: string
    password: string
}

export interface IUser {
    readonly uid: string
    readonly email: string
    readonly emailVerified: boolean
    readonly displayName: string
    readonly photoURL: string | null
    readonly phoneNumber: string
}
