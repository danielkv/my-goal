import { TTimer } from 'goal-models'
import { timerTypes } from 'goal-utils'

import { Component, For, Show, createMemo } from 'solid-js'

import TextInput from '@components/TextInput'
import TimeInput from '@components/TimeInput'
import { Field, FormState, getValue } from '@modular-forms/solid'
import { Stack } from '@suid/material'

export type TTImersFormState = FormState<{ config: TTimer; [K: string]: any }>
export interface TimersFormProps {
    of: TTImersFormState
}

const TimersForm: Component<TimersFormProps> = (props) => {
    const type = createMemo(() => getValue(props.of, 'config.type'))

    return (
        <Stack gap={2}>
            <Field of={props.of} name="config.numberOfRounds">
                {(field) => {
                    return (
                        <TextInput
                            {...field.props}
                            class="flex-1"
                            label="Rounds"
                            type="number"
                            value={field.value}
                            error={field.error}
                        />
                    )
                }}
            </Field>
            <Stack direction="row" gap={2}>
                <Field of={props.of} name="config.type">
                    {(field) => {
                        return (
                            <div class="flex flex-col flex-1 min-w-[100px]">
                                <label class="text-sm mb-2">Timer</label>
                                <select class="input input-full" {...field.props}>
                                    <For each={Object.entries(timerTypes)}>
                                        {([key, label]) => (
                                            <option value={key} selected={field.value === key}>
                                                {label}
                                            </option>
                                        )}
                                    </For>
                                </select>
                            </div>
                        )
                    }}
                </Field>
                <Show when={type() === 'emom'}>
                    <Field of={props.of} name="config.each">
                        {(field) => (
                            <TimeInput
                                {...field.props}
                                class="flex-1"
                                label="A Cada"
                                value={field.value}
                                error={field.error}
                            />
                        )}
                    </Field>
                </Show>
                <Show when={type() === 'tabata'}>
                    <Field of={props.of} name="config.work">
                        {(field) => (
                            <TimeInput
                                {...field.props}
                                class="flex-1"
                                label="Work"
                                value={field.value}
                                error={field.error}
                            />
                        )}
                    </Field>
                    <Field of={props.of} name="config.rest">
                        {(field) => (
                            <TimeInput
                                {...field.props}
                                class="flex-1"
                                label="Rest"
                                value={field.value}
                                error={field.error}
                            />
                        )}
                    </Field>
                </Show>
                <Show when={['for_time', 'max_weight', 'amrap'].includes(type() as string)}>
                    <Field of={props.of} name="config.timecap">
                        {(field) => (
                            <TimeInput
                                {...field.props}
                                class="flex-1"
                                label="Timecap"
                                value={field.value}
                                error={field.error}
                            />
                        )}
                    </Field>
                </Show>
            </Stack>
        </Stack>
    )
}

export default TimersForm
