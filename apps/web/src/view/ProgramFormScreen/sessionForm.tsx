import { IProgramInput } from 'goal-models'
import { FiChevronDown, FiChevronUp, FiPlus, FiTrash } from 'solid-icons/fi'

import { Component, For } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, FieldArray, FieldArrayStore, FormStore, insert, remove, swap } from '@modular-forms/solid'
import { Card, FormHelperText, IconButton, Stack } from '@suid/material'

import { createEmptyGroup } from './config'
import GroupForm from './groupForm'

interface SessionFormProps {
    form: FormStore<IProgramInput, any>
    fieldArray: FieldArrayStore<IProgramInput, `segments.${number}.sessions`>
    index: number
}

const SessionForm: Component<SessionFormProps> = (props) => {
    return (
        <Card class="relative !overflow-visible !bg-gray-900">
            <Stack direction="row" gap={1} position="absolute" right={16} top={-4}>
                <IconButton
                    disabled={props.index <= 0}
                    onClick={() =>
                        swap(props.form, props.fieldArray.name, {
                            at: props.index,
                            and: props.index - 1,
                        })
                    }
                    class="!bg-gray-500 hover:!bg-gray-400"
                    size="small"
                >
                    <FiChevronUp />
                </IconButton>
                <IconButton
                    disabled={props.index >= props.fieldArray.items.length - 1}
                    onClick={() =>
                        swap(props.form, props.fieldArray.name, {
                            at: props.index,
                            and: props.index + 1,
                        })
                    }
                    class="!bg-gray-500 hover:!bg-gray-400"
                    size="small"
                >
                    <FiChevronDown />
                </IconButton>
                <IconButton
                    onClick={() => remove(props.form, props.fieldArray.name, { at: props.index })}
                    class="!bg-gray-500 hover:!bg-gray-400"
                    size="small"
                >
                    <FiTrash />
                </IconButton>
            </Stack>
            <Stack p={2} gap={2}>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.id`} type="string">
                    {(field) => <input value={field.value} hidden />}
                </Field>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.name`}>
                    {(field, fieldProps) => (
                        <TextInput {...fieldProps} label="Nome da sessão" error={field.error} value={field.value} />
                    )}
                </Field>
                <FieldArray of={props.form} name={`${props.fieldArray.name}.${props.index}.groups`}>
                    {(fieldArray) => (
                        <Stack gap={1}>
                            <Stack gap={2}>
                                <For each={fieldArray.items}>
                                    {(_, index) => (
                                        <GroupForm form={props.form} fieldArray={fieldArray} index={index()} />
                                    )}
                                </For>
                            </Stack>
                            {!!fieldArray.error && <FormHelperText error>Insira ao menos 1 classe</FormHelperText>}
                            <Stack alignItems="center">
                                <IconButton
                                    onClick={() =>
                                        insert(props.form, fieldArray.name, {
                                            at: fieldArray.items.length,
                                            value: createEmptyGroup(),
                                        })
                                    }
                                >
                                    <FiPlus title="Novo grupo" />
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
