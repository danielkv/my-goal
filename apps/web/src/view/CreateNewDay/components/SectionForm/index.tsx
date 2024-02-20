import { ISection } from 'goal-models'

import { Component, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'

import { TSectionForm, sectionFormSchema } from './config'

export interface SectionFormProps {
    onClickNext(data: TSectionForm): void
    section: ISection
}

const SectionForm: Component<SectionFormProps> = (props) => {
    const [form, { Form, Field }] = createForm<TSectionForm>({
        validate: zodForm(sectionFormSchema),
        initialValues: props.section,
    })

    const memoData = createMemo(() => props.section)
    createEffect(
        on(memoData, () => {
            reset(form, { initialValues: memoData() })
        })
    )

    const handleSubmit: SubmitHandler<TSectionForm> = (values) => {
        props.onClickNext(values)
    }

    return (
        <Form name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field name="name">
                {(field, props) => (
                    <TextInput class="flex-1" label="Nome" value={field.value} error={field.error} {...props} />
                )}
            </Field>
            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default SectionForm
