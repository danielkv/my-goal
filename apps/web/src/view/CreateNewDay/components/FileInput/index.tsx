import { Component, JSX, Show, createMemo } from 'solid-js'

import { Button, FormHelperText } from '@suid/material'

type FileInputProps = {
    ref: (element: HTMLInputElement) => void
    name: string
    value?: File | null
    onInput: JSX.EventHandler<HTMLInputElement, InputEvent>
    onChange: JSX.EventHandler<HTMLInputElement, Event>
    onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>
    onRemove?: () => void
    accept?: string
    required?: boolean
    multiple?: boolean
    class?: string
    label?: string
    error?: string
}

const FileInput: Component<FileInputProps> = (props) => {
    const imagePreview = createMemo(() => (props.value ? URL.createObjectURL(props.value) : null))

    return (
        <>
            <Show when={!!props.value}>
                {<img src={imagePreview() || ''} class="max-w-full" />}
                <Button variant="contained" onClick={props.onRemove}>
                    Remover imagem
                </Button>
            </Show>
            <Show when={!props.value}>
                <Button role={undefined} variant="contained" component="label" tabIndex={-1}>
                    <input
                        accept="image/*"
                        hidden
                        type="file"
                        onChange={props.onChange}
                        onBlur={props.onBlur}
                        onInput={props.onInput}
                        // @ts-expect-error
                        value={props.value}
                    />
                    Selecionar Imagem
                </Button>
            </Show>
            {!!props.error && <FormHelperText error>{props.error}</FormHelperText>}
        </>
    )
}

export default FileInput
