import { Component } from 'solid-js'

import { Route, Routes } from '@solidjs/router'
import CreateNewDay from '@view/CreateNewDay'
import Home from '@view/Home'
import LoginPage from '@view/Login'
import MovementListScreen from '@view/MovementListScreen'
import Preview from '@view/Preview'
import PrivacyPolicy from '@view/PrivacyPolicy'
import UsersList from '@view/UsersList'
import WorksheetList from '@view/WorksheetList'

const AppRouter: Component = () => {
    return (
        <>
            <div class="h-full">
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Dashboard */}
                    <Route path="/worksheet" element={<WorksheetList />} />
                    <Route path="/worksheet/new" element={<CreateNewDay />} />
                    <Route path="/worksheet/view/:id" element={<Preview />} />
                    <Route path="/worksheet/:id" element={<CreateNewDay />} />
                    <Route path="/users" element={<UsersList />} />
                    <Route path="/movements" element={<MovementListScreen />} />
                    {/* End Dashboard */}
                </Routes>
            </div>
        </>
    )
}

export default AppRouter
