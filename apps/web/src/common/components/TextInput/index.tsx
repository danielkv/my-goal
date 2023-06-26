import { Component, JSX, splitProps } from 'solid-js'

export interface TextInputProps {
    name: string
    type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number' | 'date'
    label?: string
    placeholder?: string
    value?: string | number | undefined
    error?: string
    required?: boolean
    class?: JSX.HTMLAttributes<HTMLDivElement>['class']
    ref?: (element: HTMLInputElement) => void
    onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>
    onChange?: JSX.EventHandler<HTMLInputElement, Event>
    onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>
}

const TextInput: Component<TextInputProps> = (props) => {
    const [, inputProps] = splitProps(props, ['value', 'label', 'error', 'class'])

    return (
        <div class={`${props.class} flex flex-col`}>
            <label class="text-sm mb-2">{props.label}</label>
            <input {...inputProps} id={props.name} class="input input-full" value={props.value} />
            {props.error && <div class="text-red-300">{props.error}</div>}
        </div>
    )
}

export default TextInput
