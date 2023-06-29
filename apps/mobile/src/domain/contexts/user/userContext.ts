import { create } from 'zustand'

import { IUser } from '@models/user'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

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
    const socialAvailable = [
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.AppleAuthProvider.PROVIDER_ID,
        auth.TwitterAuthProvider.PROVIDER_ID,
        auth.FacebookAuthProvider.PROVIDER_ID,
        auth.GithubAuthProvider.PROVIDER_ID,
    ]

    const socialLogin = user.providerData.some((info) => socialAvailable.includes(info.providerId))

    return {
        uid: user.uid,
        email: user.email || '',
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
        socialLogin,
    }
}
