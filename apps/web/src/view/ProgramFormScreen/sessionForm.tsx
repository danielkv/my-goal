import { IProgramInput } from 'goal-models'
import { FiPlus, FiTrash } from 'solid-icons/fi'

import { Component, For } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, FieldArray, FieldArrayStore, FormStore, insert, remove } from '@modular-forms/solid'
import { Card, FormHelperText, IconButton, Stack } from '@suid/material'

import ClassForm from './classForm'
import { createEmptyClass } from './config'

interface SessionFormProps {
    form: FormStore<IProgramInput, any>
    fieldArray: FieldArrayStore<IProgramInput, `segments.${number}.sessions`>
    index: number
}

const SessionForm: Component<SessionFormProps> = (props) => {
    return (
        <Card class="relative !overflow-visible">
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
                    {(field, fieldProps) => <TextInput {...fieldProps} label="Nome" error={field.error} />}
                </Field>
                <FieldArray of={props.form} name={`${props.fieldArray.name}.${props.index}.classes`}>
                    {(fieldArray) => (
                        <Stack gap={1}>
                            <Stack gap={2}>
                                <For each={fieldArray.items}>
                                    {(_, index) => (
                                        <ClassForm form={props.form} fieldArray={fieldArray} index={index()} />
                                    )}
                                </For>
                            </Stack>
                            {!!fieldArray.error && <FormHelperText error>Insira ao menos 1 classe</FormHelperText>}
                            <Stack alignItems="center">
                                <IconButton
                                    onClick={() =>
                                        insert(props.form, fieldArray.name, {
                                            at: fieldArray.items.length,
                                            value: createEmptyClass(),
                                        })
                                    }
                                >
                                    <FiPlus title="Nova classe" />
                                </IconButton>
                            </Stack>
                        </Stack>
                    )}
                </FieldArray>
            </Stack>
        </Card>
    )
}

export default SessionForm
