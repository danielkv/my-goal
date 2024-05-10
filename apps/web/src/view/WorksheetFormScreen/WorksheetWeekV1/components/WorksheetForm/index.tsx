import { IWorksheet } from 'goal-models'

import { Component, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'

import { TWorksheetForm, worksheetFormSchema } from './config'

export interface WorksheetFormProps {
    onClickNext(data: TWorksheetForm): void
    worksheet: IWorksheet
}

const WorksheetForm: Component<WorksheetFormProps> = (props) => {
    const [form, { Form, Field }] = createForm<TWorksheetForm>({
        validate: zodForm(worksheetFormSchema),
        initialValues: props.worksheet,
    })

    const memoData = createMemo(() => props.worksheet)
    createEffect(
        on(memoData, () => {
            reset(form, { initialValues: memoData() })
        })
    )

    const handleSubmit: SubmitHandler<TWorksheetForm> = (values) => {
        props.onClickNext(values)
    }

    return (
        <Form name="teste" class="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Field name="name">
                {(field, props) => (
                    <TextInput {...props} class="flex-1" label="Nome" value={field.value} error={field.error} />
                )}
            </Field>
            <Field name="startDate">
                {(field, props) => (
                    <TextInput
                        {...props}
                        class="flex-1"
                        type="date"
                        label="Data de início"
                        value={field.value}
                        error={field.error}
                    />
                )}
            </Field>
            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default WorksheetForm
