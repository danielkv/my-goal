import { IEventBlock } from 'goal-models'

import { Component, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import TimersForm from '@components/TimersForm'
import { SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'

import { TEventBlockForm, eventBlockFormSchema } from './config'

export interface BlockFormProps {
    onClickNext(data: TEventBlockForm): void
    block: IEventBlock
}

const EventBlockForm: Component<BlockFormProps> = (props) => {
    const [form, { Form, Field }] = createForm<TEventBlockForm>({
        validate: zodForm(eventBlockFormSchema),
        initialValues: props.block,
    })

    const memoData = createMemo(() => props.block)
    createEffect(
        on(memoData, () => {
            reset(form, { initialValues: memoData() })
        })
    )

    const handleSubmit: SubmitHandler<TEventBlockForm> = (values) => {
        const newValues = { ...values, rounds: props.block.rounds || [] }
        props.onClickNext(newValues)
    }

    return (
        <Form name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field name="name">
                {(field, props) => (
                    <TextInput {...props} class="flex-1" label="Nome" value={field.value} error={field.error} />
                )}
            </Field>

            <TimersForm of={form} />

            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default EventBlockForm
