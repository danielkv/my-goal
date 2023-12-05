import { IUserSubscriptionInfo, TEntitlementsInfo } from 'goal-models'
import { create } from 'zustand'

import { IUser } from '@models/user'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

export interface UserContext {
    user: IUser | null
    subscriptionInfo: IUserSubscriptionInfo | null
    setSubscriptionInfo(subscriptionInfo: IUserSubscriptionInfo | null): void
    setUser(user: IUser | null): void
}

export const useUserContext = create<UserContext>((set) => ({
    user: null,
    subscriptionInfo: null,
    setSubscriptionInfo(subscriptionInfo) {
        set({ subscriptionInfo })
    },
    setUser(user: IUser | null) {
        set({ user })
    },
}))

export const useEntitlements = (): TEntitlementsInfo => {
    return useUserContext((c) => c.subscriptionInfo?.entitlements || {})
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
        email: user.email || undefined,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || undefined,
        socialLogin,
    }
}
