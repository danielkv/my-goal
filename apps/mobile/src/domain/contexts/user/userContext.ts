import { create } from 'zustand'

import { IUser } from '@models/user'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

export interface UserContextCredentials {
    sessionCookie: string
    userId: string
    email: string
}

export interface UserContext {
    user: IUser | null
    serUser(user: IUser | null): void
}

export const useUserContext = create<UserContext>((set) => ({
    user: null,
    serUser(user: IUser | null) {
        set({ user })
    },
}))

export const setLoggedUser = (user: IUser | null): void => {
    useUserContext.getState().serUser(user)
}

export const useLoggedUser = (): IUser | null => {
    return useUserContext((c) => c.user)
}

export function extractUserCredential(user: FirebaseAuthTypes.User): IUser {
    return {
        uid: user.uid,
        email: user.email || '',
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
    }
}
