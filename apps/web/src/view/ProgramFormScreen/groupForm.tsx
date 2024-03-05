import { IProgramInput } from 'goal-models'
import { pluralize } from 'goal-utils'
import { FiChevronDown, FiChevronUp, FiTrash } from 'solid-icons/fi'
import { EditorContent, createEditor } from 'tiptap-solid'

import { Component, For, Show } from 'solid-js'

import TextInput from '@components/TextInput'
import {
    Field,
    FieldArray,
    FieldArrayStore,
    FormStore,
    getValue,
    remove,
    setValue,
    setValues,
    swap,
} from '@modular-forms/solid'
import { Card, FormHelperText, IconButton, Stack } from '@suid/material'
import { mergeAttributes } from '@tiptap/core'
import Mention from '@tiptap/extension-mention'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

import EditorMenu from './components/EditorMenu'
import { extractMentions } from './config'
import { suggestion } from './suggestions'

interface ClassFormProps {
    form: FormStore<IProgramInput, any>
    fieldArray: FieldArrayStore<IProgramInput, `segments.${number}.sessions.${number}.groups`>
    index: number
}

export const CustomMention = Mention.extend({
    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: (element) => {
                    return {
                        id: element.getAttribute('data-mention-uuid'),
                    }
                },
                renderHTML: (attributes) => {
                    if (!attributes.id) {
                        return {}
                    }

                    return {
                        'data-mention-uuid': attributes.id,
                    }
                },
            },
            label: {
                default: null,
                parseHTML: (element) => {
                    return {
                        label: element.textContent,
                    }
                },
                renderHTML: (attributes) => {
                    if (!attributes.label) {
                        return {}
                    }

                    return {
                        label: attributes.label,
                    }
                },
            },
        }
    },
    parseHTML() {
        return [
            {
                tag: 'span[data-mention-uuid]',
            },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        const outputText = `${this.options.suggestion.char}${node.attrs.label}`

        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), outputText]
    },

    renderText({ node }) {
        return `${this.options.suggestion.char}${node.attrs.label}`
    },
})

const GroupForm: Component<ClassFormProps> = (props) => {
    const textInputName = `${props.fieldArray.name}.${props.index}.text` as const
    const jsonTextInputName = `${props.fieldArray.name}.${props.index}.jsontext` as const

    const editor = createEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2], HTMLAttributes: { class: 'editor-heading' } },
                bulletList: { keepMarks: true, HTMLAttributes: { class: 'editor-list' } },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
            }),
            Underline,

            CustomMention.configure({
                HTMLAttributes: {
                    class: 'mention-movement',
                },
                suggestion,
            }),
        ],
        onUpdate({ editor }) {
            const movements = extractMentions(editor.getJSON()).map((item) => ({ group_id: '', movement_id: item.id }))

            setValue(props.form, textInputName, editor.getHTML())
            setValue(props.form, jsonTextInputName, JSON.stringify(editor.getJSON()))
            setValues(props.form, `${props.fieldArray.name}.${props.index}.movements`, movements)
            editor.chain().focus().run()
        },
        onCreate({ editor }) {
            const text = getValue(props.form, jsonTextInputName)
            if (!text) return
            editor.commands.setContent(JSON.parse(text))
        },
    })

    return (
        <Card class="!bg-gray-700 relative !overflow-visible">
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
                            <EditorContent editor={editor()} />
                        </div>
                    )}
                </Field>
                <Field of={props.form} name={`${props.fieldArray.name}.${props.index}.jsontext`}>
                    {(field) => <input value={field.value || ''} hidden />}
                </Field>
                <FieldArray of={props.form} name={`${props.fieldArray.name}.${props.index}.movements`}>
                    {(fieldArray) => (
                        <>
                            <div class="text-sm text-gray-400 -mt-3">
                                {fieldArray.items.length
                                    ? `${fieldArray.items.length} ${pluralize(
                                          fieldArray.items.length as number,
                                          'movimento associado',
                                          'movimentos associados'
                                      )}`
                                    : 'Nenhum movimento associado'}
                            </div>
                            <For each={fieldArray.items}>
                                {(_, index) => (
                                    <>
                                        <Field of={props.form} name={`${fieldArray.name}.${index()}.id`} type="string">
                                            {(field) => <input value={field.value} hidden />}
                                        </Field>
                                        <Field
                                            of={props.form}
                                            name={`${fieldArray.name}.${index()}.group_id`}
                                            type="string"
                                        >
                                            {(field) => <input value={field.value} hidden />}
                                        </Field>
                                        <Field
                                            of={props.form}
                                            name={`${fieldArray.name}.${index()}.movement_id`}
                                            type="string"
                                        >
                                            {(field) => <input value={field.value} hidden />}
                                        </Field>
                                    </>
                                )}
                            </For>
                        </>
                    )}
                </FieldArray>
            </Stack>
        </Card>
    )
}

export default GroupForm
