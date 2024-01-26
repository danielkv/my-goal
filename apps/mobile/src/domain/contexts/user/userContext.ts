import { IUser, IUserData, IUserSubscriptionInfo, TEntitlementsInfo } from 'goal-models'
import { create } from 'zustand'

import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { User } from '@supabase/supabase-js'

export interface UserContext {
    user: IUserData | null
    subscriptionInfo: IUserSubscriptionInfo | null
    setSubscriptionInfo(subscriptionInfo: IUserSubscriptionInfo | null): void
    setUser(user: IUserData | null): void
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

export const useLoggedUser = () => {
    return useUserContext((c) => c.user)
}

export function extractUserCredential(user: FirebaseAuthTypes.User): IUserData {
    return {
        id: user.uid,
        email: user.email || '',
        photoUrl: user.photoURL || '',
        displayName: user.displayName || '',
        phone: user.phoneNumber || null,
    }
}

export function extractSupabaseUserCredential(user: User): IUserData {
    return {
        id: user.id,
        email: user.email || '',
        photoUrl: user.user_metadata.photoUrl || null,
        displayName: user.user_metadata.displayName || '',
        phone: user.phone || null,
    }
}
