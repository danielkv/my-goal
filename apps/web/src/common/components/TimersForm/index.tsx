import { TTimerTypes } from 'goal-models'

import { Component, Show } from 'solid-js'

import TimeInput from '@components/TimeInput'
import { Field, FormState } from '@modular-forms/solid'

export interface TimersFormProps {
    of: FormState<any>
    type: TTimerTypes
}
const TimersForm: Component<TimersFormProps> = (props) => {
    return (
        <>
            <Show when={props.type === 'emom'}>
                <Field of={props.of} name="each">
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
            <Show when={props.type === 'tabata'}>
                <Field of={props.of} name="work">
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
                <Field of={props.of} name="rest">
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
            <Show when={['for_time', 'max_weight', 'amrap'].includes(props.type)}>
                <Field of={props.of} name="timecap">
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
        </>
    )
}

export default TimersForm
