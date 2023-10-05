import { IEventBlock } from 'goal-models'

import { Component, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import TimersForm from '@components/TimersForm'
import { Field, Form, SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'

import { TEventBlockForm, eventBlockFormSchema } from './config'

export interface BlockFormProps {
    onClickNext(data: TEventBlockForm): void
    block: IEventBlock
}

const EventBlockForm: Component<BlockFormProps> = (props) => {
    const form = createForm<TEventBlockForm>({
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
        <Form<TEventBlockForm> of={form} name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field of={form} name="name">
                {(field) => (
                    <TextInput {...field.props} class="flex-1" label="Nome" value={field.value} error={field.error} />
                )}
            </Field>

            {/* @ts-expect-error */}
            <TimersForm of={form} />

            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default EventBlockForm
