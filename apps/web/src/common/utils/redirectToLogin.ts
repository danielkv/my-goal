import { createEffect } from 'solid-js'

import { loggedUser } from '@contexts/user/user.context'
import { useNavigate } from '@solidjs/router'

export function redirectToLogin() {
    const navigate = useNavigate()

    createEffect(() => {
        if (loggedUser() === null) {
            navigate('/dashboard/login')
        }
    })
}
