export interface IUserData {
    readonly uid: string
    readonly email?: string
    readonly emailVerified: boolean
    readonly displayName?: string
    readonly photoURL?: string | null
    readonly phoneNumber?: string
    readonly disabled: boolean
}
