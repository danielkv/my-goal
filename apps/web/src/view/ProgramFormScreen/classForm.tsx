import { IProgramInput } from 'goal-models'
import { FiTrash } from 'solid-icons/fi'

import { Component } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, FieldArrayStore, FormStore, remove } from '@modular-forms/solid'
import { Card, IconButton, Stack } from '@suid/material'

interface ClassFormProps {
    form: FormStore<IProgramInput, any>
    fieldArray: FieldArrayStore<IProgramInput, `segments.${number}.sessions.${number}.classes`>
    index: number
}

const ClassForm: Component<ClassFormProps> = (props) => {
    return (
        <Card class="!bg-gray-700 relative !overflow-visible">
            <Stack direction="row" gap={2} position="absolute" right={16} top={-14}>
                <IconButton
                    onClick={() => remove(props.form, props.fieldArray.name, { at: props.index })}
                    class="!bg-gray-500 hover:!bg-gray-400"
                    size="small"
                >
                    <FiTrash />
                </IconButton>
            </Stack>
            <Stack p={2} gap={2}>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.name`}>
                    {(field, fieldProps) => (
                        <TextInput {...fieldProps} label="Nome" error={field.error} value={field.value || ''} />
                    )}
                </Field>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.video`}>
                    {(field, fieldProps) => (
                        <TextInput {...fieldProps} label="Vídeo" error={field.error} value={field.value || ''} />
                    )}
                </Field>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.text`}>
                    {(field, fieldProps) => (
                        <TextInput
                            {...fieldProps}
                            multiline
                            rows={5}
                            label="Texto"
                            error={field.error}
                            value={field.value || ''}
                        />
                    )}
                </Field>
            </Stack>
        </Card>
    )
}

export default ClassForm
