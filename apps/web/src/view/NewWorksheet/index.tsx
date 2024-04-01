import { IWorksheetInput, Typefy } from 'goal-models'

import { Component } from 'solid-js'

import DashboardContainer from '@components/DashboardContainer'
import { createForm } from '@modular-forms/solid'

import WorksheetPeace from './components/FormPeaces/worksheet'
import { createEmptyWorksheet } from './config'

const NewWorksheet: Component = () => {
    //    redirectToLogin()

    const [form] = createForm<Typefy<IWorksheetInput<'v2'>>>({
        initialValues: createEmptyWorksheet(),
    })

    return (
        <DashboardContainer>
            <WorksheetPeace form={form} />
        </DashboardContainer>
    )
}

export default NewWorksheet
