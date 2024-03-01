import { IProgramInput } from 'goal-models'
import { FiPlus, FiTrash } from 'solid-icons/fi'
import { createTiptapEditor } from 'solid-tiptap'

import { Component, Show } from 'solid-js'
import { For } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, FieldArray, FieldArrayStore, FormStore, getValue, insert, remove, setValue } from '@modular-forms/solid'
import { Card, FormHelperText, IconButton, Stack } from '@suid/material'
import BulletList from '@tiptap/extension-bullet-list'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

import EditorMenu from './components/EditorMenu'
import { createEmptyMovement } from './config'
import MovementForm from './movementForm'

interface ClassFormProps {
    form: FormStore<IProgramInput, any>
    fieldArray: FieldArrayStore<IProgramInput, `segments.${number}.sessions.${number}.groups`>
    index: number
}

const GroupForm: Component<ClassFormProps> = (props) => {
    const textInputName = `${props.fieldArray.name}.${props.index}.text` as const

    let editorRef!: HTMLDivElement

    const editor = createTiptapEditor(() => ({
        element: editorRef!,
        extensions: [
            StarterKit,

            BulletList.configure({ keepMarks: true, HTMLAttributes: { class: 'editor-list' } }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
            }),
            Underline,
            Heading.configure({
                levels: [1, 2],
                HTMLAttributes: { class: 'editor-heading' },
            }),
        ],
        onBlur({ editor }) {
            setValue(props.form, textInputName, editor.getHTML())
        },
        content: getValue(props.form, `${props.fieldArray.name}.${props.index}.text`),
    }))

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
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.id`} type="string">
                    {(field) => <input value={field.value} hidden />}
                </Field>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.name`}>
                    {(field, fieldProps) => (
                        <TextInput
                            {...fieldProps}
                            label="Nome do grupo"
                            error={field.error}
                            value={field.value || ''}
                        />
                    )}
                </Field>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.video`}>
                    {(field, fieldProps) => (
                        <TextInput {...fieldProps} label="Vídeo" error={field.error} value={field.value || ''} />
                    )}
                </Field>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.text`}>
                    {() => (
                        <div class="relative">
                            <FormHelperText>Texto</FormHelperText>
                            <Show when={editor()}>
                                {(editorInstance) => (
                                    <div class="absolute top-6 left-0 right-0 z-50">
                                        <EditorMenu editor={editorInstance()} />
                                    </div>
                                )}
                            </Show>
                            <div ref={editorRef} />
                        </div>
                    )}
                </Field>
                <FieldArray of={props.form} name={`${props.fieldArray.name}.${props.index}.movements`}>
                    {(fieldArray) => (
                        <Stack gap={1}>
                            <Stack gap={2}>
                                <For each={fieldArray.items}>
                                    {(_, index) => (
                                        <MovementForm form={props.form} fieldArray={fieldArray} index={index()} />
                                    )}
                                </For>
                            </Stack>
                            {!!fieldArray.error && <FormHelperText error>Insira ao menos 1 movimento</FormHelperText>}
                            <Stack alignItems="center">
                                <IconButton
                                    onClick={() =>
                                        insert(props.form, fieldArray.name, {
                                            at: fieldArray.items.length,
                                            value: createEmptyMovement(),
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

export default GroupForm
