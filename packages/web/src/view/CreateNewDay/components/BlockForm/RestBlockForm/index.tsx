import { Component, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import TimeInput from '@components/TimeInput'
import { IRestBlock } from '@models/block'
import { Field, Form, SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'

import { TRestBlockForm, restBlockFormSchema } from './config'

export interface RestBlockFormProps {
    onClickNext(data: TRestBlockForm): void
    block: IRestBlock
}

const RestBlockForm: Component<RestBlockFormProps> = (props) => {
    const form = createForm<TRestBlockForm>({
        validate: zodForm(restBlockFormSchema),
        initialValues: props.block,
    })

    const memoData = createMemo(() => props.block)
    createEffect(
        on(memoData, () => {
            reset(form, { initialValues: memoData() })
        })
    )

    const handleSubmit: SubmitHandler<TRestBlockForm> = (values) => {
        props.onClickNext(values)
    }

    return (
        <Form<TRestBlockForm> of={form} name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field of={form} name="time">
                {(field) => (
                    <TimeInput {...field.props} class="flex-1" label="Tempo" value={field.value} error={field.error} />
                )}
            </Field>

            <Field of={form} name="text">
                {(field) => (
                    <TextInput {...field.props} class="flex-1" label="Texto" value={field.value} error={field.error} />
                )}
            </Field>

            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default RestBlockForm
