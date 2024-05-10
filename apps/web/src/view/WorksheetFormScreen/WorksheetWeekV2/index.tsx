import { IWorksheetInput, Typefy } from 'goal-models'
import { isWorksheetInputV2 } from 'goal-utils'

import { Component, createEffect } from 'solid-js'

import { createForm, getValues } from '@modular-forms/solid'

import { IWorksheetFormBaseProps } from '../types'

import WorksheetPeace from './components/FormPeaces/worksheet'
import { createEmptyWorksheet } from './config'

interface WorksheetWeekV2Props extends IWorksheetFormBaseProps {
    initialData: IWorksheetInput<'v2'> | null
}

const WorksheetWeekV2: Component<WorksheetWeekV2Props> = (props) => {
    const [form] = createForm<Typefy<IWorksheetInput<'v2'>>>({
        initialValues: props.initialData || createEmptyWorksheet(),
    })

    createEffect(() => {
        const week = getValues(form)

        if (isWorksheetInputV2(week)) props.saveDraft(week)
    })

    return <WorksheetPeace form={form} />
}

export default WorksheetWeekV2
