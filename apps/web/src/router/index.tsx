import { Component } from 'solid-js'

import { Route, Routes } from '@solidjs/router'
import Home from '@view/Home'
import LoginPage from '@view/Login'
import MovementListScreen from '@view/MovementListScreen'
import PasswordRecoveryPage from '@view/PasswordRecovery'
import Preview from '@view/Preview'
import PrivacyPolicy from '@view/PrivacyPolicy'
import ProgramFormScreen from '@view/ProgramFormScreen'
import ProgramListScreen from '@view/ProgramListScreen'
import ResetPasswordPage from '@view/ResetPassword'
import TermsOfUse from '@view/TermsOfUse'
import UserDetailsScreen from '@view/UserDetailsScreen'
import UsersListScreen from '@view/UsersList'
import WorksheetFormScreen from '@view/WorksheetFormScreen'
import WorksheetListScreen from '@view/WorksheetListScreen'
import WorksheetWeeksScreen from '@view/WorksheetWeeksScreen'

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

                        {/* DEPRECATED */}
                        <Route path="/worksheet/view/:id" element={<Preview />} />

                        <Route path="/" element={<WorksheetListScreen />} />
                        <Route path="/worksheet/:worksheetId/new" element={<WorksheetFormScreen />} />
                        <Route path="/worksheet/:worksheetId" element={<WorksheetWeeksScreen />} />
                        <Route path="/worksheet/:worksheetId/:weekId" element={<WorksheetFormScreen />} />

                        <Route path="/users" element={<UsersListScreen />} />
                        <Route path="/users/:id" element={<UserDetailsScreen />} />
                        <Route path="/movements" element={<MovementListScreen />} />

                        <Route path="/programs" element={<ProgramListScreen />} />
                        <Route path="/program/new" element={<ProgramFormScreen />} />
                        <Route path="/program/:programId" element={<ProgramFormScreen />} />
                    </Route>
                    {/* End Dashboard */}
                </Routes>
            </div>
        </>
    )
}

export default AppRouter
