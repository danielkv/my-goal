import { IDay } from 'goal-models'

import { Component, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'

import { TDayForm, dayFormSchema } from './config'

export interface DayFormProps {
    onClickNext(data: TDayForm): void
    day: IDay
}

const DayForm: Component<DayFormProps> = (props) => {
    const [form, { Form, Field }] = createForm<TDayForm>({
        validate: zodForm(dayFormSchema),
        initialValues: props.day,
    })

    const memoData = createMemo(() => props.day)
    createEffect(
        on(memoData, () => {
            reset(form, { initialValues: memoData() })
        })
    )

    const handleSubmit: SubmitHandler<TDayForm> = (values) => {
        props.onClickNext(values)
    }

    return (
        <Form name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field name="date">
                {(field, props) => (
                    <TextInput
                        {...props}
                        class="flex-1"
                        label="Data"
                        type="date"
                        value={field.value}
                        error={field.error}
                    />
                )}
            </Field>

            <Field name="name">
                {(field, props) => (
                    <TextInput class="flex-1" label="Nome" value={field.value || ''} error={field.error} {...props} />
                )}
            </Field>

            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default DayForm
