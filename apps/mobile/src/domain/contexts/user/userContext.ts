import Purchases, { PurchasesEntitlementInfo } from 'react-native-purchases'

import { create } from 'zustand'

import { IUser } from '@models/user'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

type IEntitlementsInfo = Record<string, PurchasesEntitlementInfo>

export interface UserContext {
    user: IUser | null
    entitlements: IEntitlementsInfo
    setEntitlements(entitlement: IEntitlementsInfo): void
    serUser(user: IUser | null): Promise<void>
}

export const useUserContext = create<UserContext>((set) => ({
    user: null,
    entitlements: {},
    setEntitlements(entitlements) {
        set({ entitlements })
    },
    async serUser(user: IUser | null) {
        let entitlements = {}

        if (user?.email) {
            const info = await Purchases.getCustomerInfo()
            entitlements = info.entitlements.active
            console.log(entitlements)
        }

        set({ user, entitlements })
    },
}))

export const setLoggedUser = async (user: IUser | null): Promise<void> => {
    if (user?.email) await Purchases.logIn(user?.email)
    else await Purchases.logOut()

    return useUserContext.getState().serUser(user)
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
