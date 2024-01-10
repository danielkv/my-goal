import { useCallback } from 'react'

import { APP_ENTITLEMENTS } from 'goal-models'

import { useLoggedUser } from '@contexts/user/userContext'
import { StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { userIsEntitledUseCase } from '@useCases/subscriptions/userHasEntitlement'

export function usePreventAccess(entitlementId?: APP_ENTITLEMENTS | APP_ENTITLEMENTS[], and = false) {
    const { dispatch } = useNavigation()
    const route = useRoute()
    const user = useLoggedUser()

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

            if (!skipPages && entitlementId && !userIsEntitledUseCase(entitlementId, and))
                return dispatch(
                    StackActions.replace(ERouteName.SelectSubscription, {
                        redirect: route.name,
                        redirectParams: route.params,
                    })
                )
        }, [user])
    )

    return user
}
