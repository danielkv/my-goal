import { IProgramInput } from 'goal-models'
import { FiPlus, FiTrash } from 'solid-icons/fi'

import { Component } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, FieldArrayStore, FormStore } from '@modular-forms/solid'
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
                <IconButton class="!bg-gray-500 hover:!bg-gray-400" size="small">
                    <FiTrash />
                </IconButton>
                <IconButton class="!bg-gray-500 hover:!bg-gray-400" size="small">
                    <FiPlus />
                </IconButton>
            </Stack>
            <Stack p={2} gap={2}>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.name`}>
                    {(_, fieldProps) => <TextInput {...fieldProps} label="Nome" />}
                </Field>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.video`}>
                    {(_, fieldProps) => <TextInput {...fieldProps} label="Vídeo" />}
                </Field>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.text`}>
                    {(_, fieldProps) => <TextInput {...fieldProps} multiline rows={5} label="Texto" />}
                </Field>
            </Stack>
        </Card>
    )
}

export default ClassForm
