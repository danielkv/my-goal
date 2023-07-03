import { useCallback } from 'react'

import { useLoggedUser } from '@contexts/user/userContext'
import { StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName } from '@router/types'

export function usePreventAccess() {
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
        }, [user])
    )
}
