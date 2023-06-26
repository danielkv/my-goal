import { ISection } from 'goal-models'

import { Component, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, Form, SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'

import { TSectionForm, sectionFormSchema } from './config'

export interface SectionFormProps {
    onClickNext(data: TSectionForm): void
    section: ISection
}

const SectionForm: Component<SectionFormProps> = (props) => {
    const form = createForm<TSectionForm>({
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
        <Form<TSectionForm> of={form} name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
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

export default SectionForm
