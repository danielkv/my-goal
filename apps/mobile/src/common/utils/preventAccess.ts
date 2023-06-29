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
            if (!user) dispatch(StackActions.replace(ERouteName.LoginScreen))

            if (route.name !== ERouteName.SubscriptionScreen && (!user?.phoneNumber || !user.displayName))
                dispatch(
                    StackActions.replace(ERouteName.SubscriptionScreen, {
                        redirect: route.name,
                        redirectParams: route.params,
                    })
                )
        }, [user])
    )
}
