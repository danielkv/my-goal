import { Component } from 'solid-js'

import { Route, Routes } from '@solidjs/router'
import CreateNewDay from '@view/CreateNewDay'
import Home from '@view/Home'
import LoginPage from '@view/Login'
import MovementListScreen from '@view/MovementListScreen'
import PasswordRecoveryPage from '@view/PasswordRecovery'
import Preview from '@view/Preview'
import PrivacyPolicy from '@view/PrivacyPolicy'
import ResetPasswordPage from '@view/ResetPassword'
import TermsOfUse from '@view/TermsOfUse'
import UsersList from '@view/UsersList'
import WorksheetList from '@view/WorksheetList'

const AppRouter: Component = () => {
    return (
        <>
            <div class="h-full">
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
                    <Route path="/termos-de-uso" element={<TermsOfUse />} />

                    {/* Dashboard */}
                    <Route path="/dashboard">
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/" element={<WorksheetList />} />
                        <Route path="/worksheet/new" element={<CreateNewDay />} />
                        <Route path="/worksheet/view/:id" element={<Preview />} />
                        <Route path="/worksheet/:id" element={<CreateNewDay />} />
                        <Route path="/users" element={<UsersList />} />
                        <Route path="/dashboard/movements" element={<MovementListScreen />} />
                    </Route>
                    {/* End Dashboard */}
                </Routes>
            </div>
        </>
    )
}

export default AppRouter
