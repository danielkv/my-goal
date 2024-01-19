import { IUser, IUserSubscriptionInfo, TEntitlementsInfo } from 'goal-models'
import { create } from 'zustand'

import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { User } from '@supabase/supabase-js'

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
    return {
        id: user.uid,
        email: user.email || '',
        photoURL: user.photoURL || '',
        displayName: user.displayName || '',
        phone: user.phoneNumber || undefined,
    }
}

export function extractSupabaseUserCredential(user: User): IUser {
    return {
        id: user.id,
        email: user.email || '',

        displayName: user.user_metadata.displayName || '',
        phone: user.phone || '',
    }
}
