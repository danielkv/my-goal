import { Component, createSignal } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import Header from '@components/Header'
import { Route, Routes } from '@solidjs/router'
import { initialLoadUseCase } from '@useCases/app/initialLoad'
import CreateNewDay from '@view/CreateNewDay'
import Home from '@view/Home'
import LoginPage from '@view/Login'
import MovementListScreen from '@view/MovementListScreen'
import Preview from '@view/Preview'
import PrivacyPolicy from '@view/PrivacyPolicy'
import TimersHome from '@view/TimersHome'
import UsersList from '@view/UsersList'
import WorksheetList from '@view/WorksheetList'

const AppRouter: Component = () => {
    const [loading, setLoading] = createSignal(true)

    initialLoadUseCase().finally(() => {
        setLoading(false)
    })

    return (
        <>
            {loading() ? (
                <div class="w-full h-full flex items-center justify-center">
                    <ActivityIndicator color="#fff" size={40} />
                </div>
            ) : (
                <div class="h-full">
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/worksheet" element={<WorksheetList />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/worksheet/new" element={<CreateNewDay />} />
                        <Route path="/worksheet/view/:id" element={<Preview />} />
                        <Route path="/worksheet/:id" element={<CreateNewDay />} />

                        <Route path="/timer/stopwatch" element={<TimersHome timer="stopwatch" />} />
                        <Route path="/timer/regressive" element={<TimersHome timer="regressive" />} />
                        <Route path="/timer/emom" element={<TimersHome timer="emom" />} />
                        <Route path="/timer/tabata" element={<TimersHome timer="tabata" />} />

                        <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
                        <Route path="/users" element={<UsersList />} />
                        <Route path="/movements" element={<MovementListScreen />} />
                    </Routes>
                </div>
            )}
        </>
    )
}

export default AppRouter
