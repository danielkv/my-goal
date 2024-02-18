import { Component, createEffect, onCleanup } from 'solid-js'

import { supabase } from '@common/providers/supabase'
import { theme } from '@common/theme'
import { setLoggedUser } from '@contexts/user/user.context'
import { useLocation, useNavigate } from '@solidjs/router'
import { ThemeProvider } from '@suid/material'
import { extractUserCredential } from '@utils/users'

import AppRouter from './router'

const App: Component = () => {
    const navigate = useNavigate()
    const location = useLocation()

    createEffect(async () => {
        const script = document.createElement('script')
        script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY}`
        script.async = true
        document.head.appendChild(script)
    })

    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
        if (!session || ['SIGNED_OUT'].includes(event)) {
            setLoggedUser(null)
            return
        }

        if (session.user.app_metadata?.claims_admin !== true) {
            alert('Você não tem permissão para acessar essa página')
            setLoggedUser(null)
            navigate('/dashboard/login')
            return
        }

        setLoggedUser(extractUserCredential(session.user))

        if (location.pathname === '/dashboard/login') navigate('/dashboard')
    })

    onCleanup(() => {
        subscription.unsubscribe()
    })

    return (
        <ThemeProvider theme={theme}>
            <AppRouter />
        </ThemeProvider>
    )
}

export default App
