import { Component, createEffect, createSignal } from 'solid-js'

import DashboardContainer from '@components/DashboardContainer'
import { useParams } from '@solidjs/router'
import { getProgramByIdUseCase } from '@useCases/programs/getProgramById'

import { createEmptyProgram } from './config'
import ProgramForm from './form'

const ProgramFormScreen: Component = () => {
    const params = useParams<{ programId?: string }>()

    const [loading, setLoading] = createSignal(true)
    const [initialValues, setInitialValues] = createSignal(createEmptyProgram())

    createEffect(() => {
        if (!params.programId) return setLoading(false)

        getProgramByIdUseCase(params.programId).then((result) => {
            setInitialValues(result)
            setLoading(false)
        })
    })

    return (
        <DashboardContainer>
            {!loading() && <ProgramForm editing={!!params.programId} initialValues={initialValues()} />}
        </DashboardContainer>
    )
}

export default ProgramFormScreen
