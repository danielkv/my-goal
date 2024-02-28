import { IProgramInput } from 'goal-models'
import { FiTrash } from 'solid-icons/fi'
import { createTiptapEditor } from 'solid-tiptap'

import { Component, Show } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, FieldArrayStore, FormStore, getValue, remove, setValue } from '@modular-forms/solid'
import { Card, IconButton, Stack } from '@suid/material'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import BulletList from '@tiptap/extension-bullet-list'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

import EditorMenu from './components/EditorMenu'

interface ClassFormProps {
    form: FormStore<IProgramInput, any>
    fieldArray: FieldArrayStore<IProgramInput, `segments.${number}.sessions.${number}.classes`>
    index: number
}

const ClassForm: Component<ClassFormProps> = (props) => {
    const textInputName = `${props.fieldArray.name}.${props.index}.text` as const

    let editorRef!: HTMLDivElement
    let bubleMenuRef!: HTMLDivElement

    const editor = createTiptapEditor(() => ({
        element: editorRef!,
        extensions: [
            StarterKit,
            BubbleMenu.configure({ element: bubleMenuRef! }),
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
        onUpdate({ editor }) {
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
                        <TextInput {...fieldProps} label="Nome" error={field.error} value={field.value || ''} />
                    )}
                </Field>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.video`}>
                    {(field, fieldProps) => (
                        <TextInput {...fieldProps} label="Vídeo" error={field.error} value={field.value || ''} />
                    )}
                </Field>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.text`}>
                    {() => (
                        <>
                            <div ref={editorRef} />
                            <Show when={editor()}>
                                {(editorInstance) => <EditorMenu editor={editorInstance()} ref={bubleMenuRef} />}
                            </Show>
                        </>
                    )}
                </Field>
            </Stack>
        </Card>
    )
}

export default ClassForm
