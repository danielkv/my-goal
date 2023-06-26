import { IDay } from 'goal-models'

import { Component, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, Form, SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'

import { TDayForm, dayFormSchema } from './config'

export interface DayFormProps {
    onClickNext(data: TDayForm): void
    day: IDay
}

const DayForm: Component<DayFormProps> = (props) => {
    const form = createForm<TDayForm>({
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
        <Form<TDayForm> of={form} name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field of={form} name="date">
                {(field) => (
                    <TextInput
                        {...field.props}
                        class="flex-1"
                        label="Data"
                        type="date"
                        value={field.value}
                        error={field.error}
                    />
                )}
            </Field>

            <Field of={form} name="name">
                {(field) => (
                    <TextInput class="flex-1" label="Nome" value={field.value} error={field.error} {...field.props} />
                )}
            </Field>

            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default DayForm
