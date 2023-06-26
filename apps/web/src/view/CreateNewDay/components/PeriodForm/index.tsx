import { IPeriod } from 'goal-models'

import { Component, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, Form, SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'

import { TPeriodForm, periodFormSchema } from './config'

export interface PeriodFormProps {
    onClickNext(data: TPeriodForm): void
    period: IPeriod
}

const PeriodForm: Component<PeriodFormProps> = (props) => {
    const form = createForm<TPeriodForm>({
        validate: zodForm(periodFormSchema),
        initialValues: props.period,
    })

    const memoData = createMemo(() => props.period)
    createEffect(
        on(memoData, () => {
            reset(form, { initialValues: memoData() })
        })
    )

    const handleSubmit: SubmitHandler<TPeriodForm> = (values) => {
        props.onClickNext(values)
    }

    return (
        <Form<TPeriodForm> of={form} name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field of={form} name="name">
                {(field) => (
                    <TextInput {...field.props} class="flex-1" label="Nome" value={field.value} error={field.error} />
                )}
            </Field>
            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default PeriodForm
