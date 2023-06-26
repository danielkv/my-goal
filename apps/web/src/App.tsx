import { User } from 'firebase/auth'

import { Component, onCleanup } from 'solid-js'

import { firebaseProvider } from '@common/providers/firebase'
import { theme } from '@common/theme'
import { setLoggedUser } from '@contexts/user/user.context'
import { useLocation, useNavigate } from '@solidjs/router'
import { ThemeProvider } from '@suid/material'
import { getErrorMessage } from '@utils/errors'
import { extractUserCredential } from '@utils/users'

import AppRouter from './router'

const App: Component = () => {
    const navigate = useNavigate()
    const location = useLocation()

    function handleAuthStateChanged(user: User | null) {
        if (!user || !user?.email) return setLoggedUser(null)

        user.getIdTokenResult()
            .then(({ claims }) => {
                if (!claims.admin) {
                    alert('Você não tem permissão para acessar essa página')
                    navigate('/')
                    return firebaseProvider.getAuth().signOut()
                }

                setLoggedUser(extractUserCredential(user))

                if (location.pathname === '/login') navigate('worksheet')
            })
            .catch((err) => {
                alert(getErrorMessage(err))
                return firebaseProvider.getAuth().signOut()
            })
    }

    const unsubscribe = firebaseProvider.getAuth().onAuthStateChanged(handleAuthStateChanged)

    onCleanup(() => {
        unsubscribe()
    })

    return (
        <ThemeProvider theme={theme}>
            <AppRouter />
        </ThemeProvider>
    )
}

export default App
