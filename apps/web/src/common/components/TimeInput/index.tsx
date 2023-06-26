import { secondsToStringTime, stringTimeToSeconds } from 'goal-utils'

import { Component, JSX, createEffect, createMemo, createSignal, splitProps } from 'solid-js'
import { DOMElement } from 'solid-js/jsx-runtime'

type TSelection = null | 'minutes' | 'seconds'

export interface TimeInputProps {
    name: string
    label?: string
    placeholder?: string
    value?: number
    error?: string
    required?: boolean
    class?: JSX.HTMLAttributes<HTMLDivElement>['class']
    ref?: (element: HTMLInputElement) => void
    onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>
    onChange?: JSX.EventHandler<HTMLInputElement, Event>
    onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>
}

type TEvent<T> = InputEvent & {
    currentTarget: T
    target: DOMElement
}

function setTargetValue(newValue: number): TEvent<HTMLInputElement> {
    return { currentTarget: { value: newValue } } as unknown as TEvent<HTMLInputElement>
}

const TimeInput: Component<TimeInputProps> = (props) => {
    const [, inputProps] = splitProps(props, ['value', 'label', 'error', 'class'])
    const [selected, setSelected] = createSignal<TSelection>(null)

    let inputRef: HTMLInputElement

    const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        const match = e.currentTarget.value.match(/\d{2}\:\d{2}/)
        if (match) {
            const seconds = stringTimeToSeconds(e.currentTarget.value)
            e.currentTarget.value = seconds as unknown as string
        }
        props.onInput?.(e)

        if (match) {
            if (selected() === 'minutes') setSelected('seconds')
            else selecteInput(selected())
        }
    }

    const handleClick: JSX.CustomEventHandlersCamelCase<HTMLInputElement>['onClick'] = (e) => {
        if (e.offsetX <= 25) {
            setSelected('minutes')
        } else {
            setSelected('seconds')
        }
    }

    const handleBlur: JSX.CustomEventHandlersCamelCase<HTMLInputElement>['onBlur'] = (e) => {
        const match = e.currentTarget.value.match(/\d+\:\d+/)

        setSelected(null)

        if (match) {
            const seconds = stringTimeToSeconds(e.currentTarget.value)
            props.onInput?.(setTargetValue(seconds))
        }

        props.onBlur?.(e)
    }

    const handleFocus: JSX.CustomEventHandlersCamelCase<HTMLInputElement>['onFocus'] = (e) => {
        if (!selected()) setSelected('minutes')
    }

    const handleKeyDown: JSX.CustomEventHandlersCamelCase<HTMLInputElement>['onKeyDown'] = (e) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'Tab'].includes(e.key)) return

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault()
                if (selected() === 'minutes') props.onInput?.(setTargetValue(Number(props.value) + 60))
                else if (selected() === 'seconds') props.onInput?.(setTargetValue(Number(props.value) + 1))
                e.preventDefault()
                break
            case 'ArrowDown':
                if (selected() === 'minutes') props.onInput?.(setTargetValue(Number(props.value) - 60))
                else if (selected() === 'seconds') props.onInput?.(setTargetValue(Number(props.value) - 1))
                e.preventDefault()
                break
            case 'ArrowLeft':
                if (selected() === 'seconds') setSelected('minutes')
                e.preventDefault()
                break
            case 'ArrowRight':
                if (selected() === 'minutes') setSelected('seconds')
                e.preventDefault()
                break

            case 'Tab':
                if (selected() === 'minutes' && !e.shiftKey) {
                    setSelected('seconds')
                    e.preventDefault()
                } else if (selected() === 'seconds' && e.shiftKey) {
                    setSelected('minutes')
                    e.preventDefault()
                }
                break
        }
        selecteInput(selected())
    }

    createEffect(() => {
        selecteInput(selected())
    })

    function selecteInput(selection: TSelection) {
        if (!selection) return

        if (selection === 'minutes') inputRef.setSelectionRange(0, 2)
        if (selection === 'seconds') inputRef.setSelectionRange(3, 5)
    }

    const value = createMemo(() => {
        if (!props.value) return '00:00'
        if (Number.isNaN(Number(props.value))) return props.value

        const res = secondsToStringTime(props.value)
        return res
    })

    return (
        <div class={`${props.class} flex flex-col`}>
            <label class="text-sm mb-2">{props.label}</label>
            <input
                onClick={handleClick}
                {...inputProps}
                ref={(ele) => (inputRef = ele)}
                id={props.name}
                onBlur={handleBlur}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                class="input input-full cursor-default"
                value={value()}
            />
            {props.error && <div class="text-red-300">{props.error}</div>}
        </div>
    )
}

export default TimeInput
