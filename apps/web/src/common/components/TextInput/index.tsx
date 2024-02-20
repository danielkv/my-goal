import { Component, JSX, splitProps } from 'solid-js'

import { TextFieldProps } from '@suid/material/TextField'

type TMultilineProps = {
    multiline: true
    ref?: (element: HTMLTextAreaElement) => void
    onInput?: JSX.EventHandler<HTMLTextAreaElement, InputEvent>
    onChange?: JSX.EventHandler<HTMLTextAreaElement, Event>
    onBlur?: JSX.EventHandler<HTMLTextAreaElement, FocusEvent>
}

type TSinglelineeProps = {
    multiline?: false
    ref?: (element: HTMLInputElement) => void
    onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>
    onChange?: JSX.EventHandler<HTMLInputElement, Event>
    onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>
}

export type TextInputProps = {
    name: string
    inputProps?: TextFieldProps['inputProps']
    InputProps?: TextFieldProps['InputProps']
    type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number' | 'date'
    label?: string
    placeholder?: string
    value?: string | number | undefined
    error?: string
    rows?: number
    required?: boolean
    disabled?: boolean
    class?: JSX.HTMLAttributes<HTMLDivElement>['class']
} & (TMultilineProps | TSinglelineeProps)

const TextInput: Component<TextInputProps> = (props) => {
    const [singlelineProps] = splitProps(props, ['type', 'placeholder', 'InputProps', 'inputProps'])
    const [multilineProps] = splitProps(props, ['rows', 'placeholder', 'InputProps', 'inputProps'])

    return (
        <div class={`${props.class} flex flex-col`}>
            {props.label && (
                <label class="text-sm">
                    {props.label}
                    {props.required && '*'}
                </label>
            )}
            {props.multiline ? (
                <textarea
                    disabled={props.disabled}
                    {...multilineProps}
                    ref={props.ref}
                    onInput={props.onInput}
                    onBlur={props.onBlur}
                    onChange={props.onChange}
                    id={props.name}
                    class="input input-full rounded-md"
                >
                    {props.value}
                </textarea>
            ) : (
                <input
                    disabled={props.disabled}
                    {...singlelineProps}
                    ref={props.ref}
                    onInput={props.onInput}
                    onBlur={props.onBlur}
                    onChange={props.onChange}
                    id={props.name}
                    class="input input-full rounded-md"
                    value={props.value}
                />
            )}
            {props.error && <div class="text-red-300">{props.error}</div>}
        </div>
    )
}

export default TextInput
