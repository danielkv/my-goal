import { useCallback } from 'react'

import { useEntitlements, useLoggedUser } from '@contexts/user/userContext'
import { StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { userHasEntitlementUseCase } from '@useCases/subscriptions/userHasEntitlement'

export function usePreventAccess(entitlementId?: string) {
    const { dispatch } = useNavigation()
    const route = useRoute()
    const user = useLoggedUser()
    const entitlements = useEntitlements()

    console.log(JSON.stringify(entitlements, null, 2))

    useFocusEffect(
        useCallback(() => {
            if (!user) return dispatch(StackActions.replace(ERouteName.LoginScreen))

            const skipPages = ([ERouteName.SubscriptionScreen, ERouteName.Profile] as string[]).includes(route.name)

            if (!skipPages && !user.displayName)
                return dispatch(
                    StackActions.replace(ERouteName.SubscriptionScreen, {
                        redirect: route.name,
                        redirectParams: route.params,
                    })
                )

            if (
                !skipPages &&
                ((entitlementId && !userHasEntitlementUseCase(entitlementId)) || !Object.entries(entitlements).length)
            )
                return dispatch(
                    StackActions.replace(ERouteName.SelectPlan, {
                        redirect: route.name,
                        redirectParams: route.params,
                    })
                )
        }, [user])
    )

    return user
}
