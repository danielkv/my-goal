import { ITextBlock } from 'goal-models'

import { Component, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'

import { TRestBlockForm, textBlockFormSchema } from './config'

export interface TextBlockFormProps {
    onClickNext(data: TRestBlockForm): void
    block: ITextBlock
}

const TextBlockForm: Component<TextBlockFormProps> = (props) => {
    const [form, { Form, Field }] = createForm<TRestBlockForm>({
        validate: zodForm(textBlockFormSchema),
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

export default TextBlockForm
