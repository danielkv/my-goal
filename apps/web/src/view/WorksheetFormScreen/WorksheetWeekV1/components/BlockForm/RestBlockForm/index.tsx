import { IRestBlock } from 'goal-models'

import { Component, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import TimeInput from '@components/TimeInput'
import { SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'

import { TRestBlockForm, restBlockFormSchema } from './config'

export interface RestBlockFormProps {
    onClickNext(data: TRestBlockForm): void
    block: IRestBlock
}

const RestBlockForm: Component<RestBlockFormProps> = (props) => {
    const [form, { Form, Field }] = createForm<TRestBlockForm>({
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
        <Form name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field type="number" name="time">
                {(field, props) => (
                    <TimeInput {...props} class="flex-1" label="Tempo" value={field.value} error={field.error} />
                )}
            </Field>

            <Field name="text">
                {(field, props) => (
                    <TextInput {...props} class="flex-1" label="Texto" value={field.value} error={field.error} />
                )}
            </Field>

            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default RestBlockForm
