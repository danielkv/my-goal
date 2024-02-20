import { IProgramInput } from 'goal-models'
import { FiPlus, FiTrash } from 'solid-icons/fi'

import { Component, For } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, FieldArray, FieldArrayStore, FormStore } from '@modular-forms/solid'
import { Card, IconButton, Stack } from '@suid/material'

import ClassForm from './classForm'

interface SessionFormProps {
    form: FormStore<IProgramInput, any>
    fieldArray: FieldArrayStore<IProgramInput, `segments.${number}.sessions`>
    index: number
}

const SessionForm: Component<SessionFormProps> = (props) => {
    return (
        <Card class="relative !overflow-visible">
            <Stack direction="row" gap={2} position="absolute" right={16} top={-14}>
                <IconButton class="!bg-gray-500 hover:!bg-gray-400" size="small">
                    <FiTrash />
                </IconButton>
                <IconButton class="!bg-gray-500 hover:!bg-gray-400" size="small">
                    <FiPlus />
                </IconButton>
            </Stack>
            <Stack p={3} gap={3}>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.name`}>
                    {(_, fieldProps) => <TextInput {...fieldProps} label="Nome" />}
                </Field>
                <FieldArray of={props.form} name={`${props.fieldArray.name}.${props.index}.classes`}>
                    {(fieldArray) => (
                        <For each={fieldArray.items}>
                            {(_, index) => <ClassForm form={props.form} fieldArray={fieldArray} index={index()} />}
                        </For>
                    )}
                </FieldArray>
            </Stack>
        </Card>
    )
}

export default SessionForm
