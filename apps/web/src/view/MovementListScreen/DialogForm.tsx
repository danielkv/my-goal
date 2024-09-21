import { IMovementInput } from 'goal-models'
import { RESULT_TYPES } from 'goal-utils'
import { EditorContent, createEditor } from 'tiptap-solid'

import { Component, Show, createEffect } from 'solid-js'
import { For } from 'solid-js'
import { createSignal } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import TextInput from '@components/TextInput'
import { createForm, getValue, setValue, setValues, zodForm } from '@modular-forms/solid'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    MenuItem,
    Select,
    Stack,
} from '@suid/material'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { saveMovementUseCase } from '@useCases/movements/saveMovement'
import { getErrorMessage } from '@utils/errors'
import EditorMenu from '@view/ProgramFormScreen/components/EditorMenu'

import { TMovementForm, createEmptyMovement, movementFormSchema } from './config'

interface DialogFormProps {
    open: boolean
    onClose?: () => void
    editing: IMovementInput | null
    onSuccess?: () => unknown | Promise<unknown>
}
const DialogForm: Component<DialogFormProps> = (props) => {
    const [form, { Form, Field }] = createForm<TMovementForm>({
        initialValues: createEmptyMovement(),
        validate: zodForm(movementFormSchema),
    })
    const [loading, setLoading] = createSignal(false)

    createEffect((prev) => {
        const content = props.editing || createEmptyMovement()

        if (prev === JSON.stringify(content)) return

        setValues(form, content)

        editor()?.commands.setContent(content.text || '')

        return JSON.stringify(content)
    }, null)

    const handleAddMovement = async (result: TMovementForm) => {
        try {
            setLoading(true)
            await saveMovementUseCase(result)

            await Promise.resolve(props.onSuccess?.())
            props.onClose?.()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

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
        ],
        onUpdate({ editor }) {
            setValue(form, 'text', editor.getHTML())

            editor.chain().focus().run()
        },
        onCreate({ editor }) {
            const text = getValue(form, 'text')
            if (!text) return
            editor.commands.setContent(JSON.parse(text))
        },
    })

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Form onSubmit={handleAddMovement}>
                <DialogTitle id="alert-dialog-title">Editar movimento</DialogTitle>
                <DialogContent class="w-[600px] max-w-[100%]">
                    <Stack gap={2}>
                        <Field name="id">{(field) => <input value={field.error} hidden />}</Field>
                        <Field name="movement">
                            {(field, props) => (
                                <TextInput error={field.error} label="Movimento" value={field.value} {...props} />
                            )}
                        </Field>
                        <Field name="resultType">
                            {(field) => (
                                <Stack>
                                    <FormHelperText>Tipo de resultado</FormHelperText>
                                    <Select
                                        error={!!field.error}
                                        style={{
                                            'background-color': 'white',
                                            'border-radius': '0.375rem',
                                            color: '#333',
                                            height: '35px',
                                        }}
                                        sx={{ ['& .MuiSelect-icon']: { color: 'black' } }}
                                        value={field.value}
                                        onChange={(e) => setValue(form, 'resultType', e.target.value)}
                                    >
                                        <For each={Object.entries(RESULT_TYPES)}>
                                            {(item) => <MenuItem value={item[0]}>{item[1]}</MenuItem>}
                                        </For>
                                    </Select>
                                </Stack>
                            )}
                        </Field>
                        <Field name="video">
                            {(field, props) => (
                                <TextInput error={field.error} label="Vídeo" value={field.value || ''} {...props} />
                            )}
                        </Field>
                        <Field name={`text`}>
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
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            setValues(form, createEmptyMovement())
                            editor()?.commands.setContent('')
                            props.onClose?.()
                        }}
                        disabled={loading()}
                    >
                        Cancelar
                    </Button>
                    <Button variant="contained" type="submit">
                        {loading() ? <ActivityIndicator color="#fff" size={24} /> : 'Salvar'}
                    </Button>
                </DialogActions>
            </Form>
        </Dialog>
    )
}

export default DialogForm
