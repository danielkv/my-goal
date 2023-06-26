import { omit } from 'radash'

import { Component, For, JSX, Show, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import TimeInput from '@components/TimeInput'
import TimersForm from '@components/TimersForm'
import { IRound } from '@models/block'
import { TTimerTypes } from '@models/time'
import {
    Field,
    FieldArray,
    Form,
    SubmitHandler,
    createForm,
    getValue,
    insert,
    remove,
    reset,
    setValue,
    zodForm,
} from '@modular-forms/solid'
import { createRoundMovementValues, roundTypes } from '@utils/worksheetInitials'

import { TRoundForm, eventRoundFormSchema, weightTypes } from './config'

export interface BlockFormProps {
    onClickNext(data: TRoundForm): void
    round: IRound
}

const RoundForm: Component<BlockFormProps> = (props) => {
    const form = createForm<TRoundForm>({
        validate: zodForm(eventRoundFormSchema),
        initialValues: props.round,
    })

    const memoData = createMemo(() => props.round)
    createEffect(
        on(memoData, () => {
            reset(form, { initialValues: memoData() })
        })
    )

    const handleSubmit: SubmitHandler<TRoundForm> = (values) => {
        const newValues = {
            ...values,
            numberOfRounds: Number.isNaN(values.numberOfRounds) ? 1 : values.numberOfRounds || 1,
            movements:
                values.movements?.map((mov) => {
                    if (!mov.weight || mov.weight?.type === 'none') return omit(mov, ['weight'])
                    return mov
                }) || [],
        }

        props.onClickNext(newValues)
    }

    const handleClickAddMovement: JSX.CustomEventHandlersCamelCase<HTMLButtonElement>['onClick'] = (e) => {
        e.preventDefault()

        insert(form, 'movements', { value: createRoundMovementValues() })
    }

    const timerType = createMemo<TTimerTypes>(() => {
        const value = getValue(form, 'type') || 'not_timed'
        if (value === 'rest') return 'not_timed'
        if (value === 'complex') return 'not_timed'

        return value
    })

    return (
        <Form<TRoundForm> of={form} name="teste" class="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Field of={form} name="type">
                {(field) => {
                    const handleInput: JSX.EventHandler<HTMLSelectElement, InputEvent> = (e) => {
                        if ((e.target as any).value === 'tabata') {
                            setValue(form, 'work', 20)
                            setValue(form, 'rest', 10)
                            setValue(form, 'numberOfRounds', 8)
                        } else if ((e.target as any).value === 'emom') {
                            setValue(form, 'each', 60)
                            setValue(form, 'numberOfRounds', 4)
                        } else if ((e.target as any).value === 'rest') {
                            reset(form, { initialValues: { type: 'rest', time: 0, movements: [] } })
                        }

                        field.props.onInput(e)
                    }
                    return (
                        <div class="flex flex-col flex-1 min-w-[100px]">
                            <label class="text-sm mb-2">Tipo de round</label>
                            <select class="input input-full" {...field.props} onInput={handleInput}>
                                <For each={Object.entries(roundTypes)}>
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

            <Show when={getValue(form, 'type') === 'rest'}>
                <Field of={form} name="time">
                    {(field) => (
                        <TimeInput
                            {...field.props}
                            class="flex-1"
                            label="Tempo"
                            value={field.value}
                            error={field.error}
                        />
                    )}
                </Field>
            </Show>

            <div class="flex flex-row gap-4">
                <TimersForm of={form} type={timerType()} />
            </div>

            <Show when={getValue(form, 'type') !== 'rest'}>
                <Field of={form} name="numberOfRounds">
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
                <div class="section-title">Movimentos</div>
                <FieldArray of={form} name="movements">
                    {(array) => (
                        <For each={array.items}>
                            {(_, index) => (
                                <div class="paper flex flex-col gap-3">
                                    <Field of={form} name={`${array.name}.${index()}.name`}>
                                        {(field) => {
                                            const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
                                                const value = getValue(form, `${array.name}.${index()}.name`)

                                                const match = value?.match(/^([\d]+)\s+(.+)/)

                                                if (!match) return

                                                setValue(form, `${array.name}.${index()}.name`, match[2])
                                                setValue(form, `${array.name}.${index()}.reps`, match[1])

                                                field.props.onBlur(e)
                                            }

                                            return (
                                                <TextInput
                                                    {...field.props}
                                                    onBlur={handleBlur}
                                                    class="flex-1"
                                                    label="Nome"
                                                    value={field.value}
                                                    error={field.error}
                                                />
                                            )
                                        }}
                                    </Field>
                                    <Field of={form} name={`${array.name}.${index()}.reps`}>
                                        {(field) => (
                                            <TextInput
                                                {...field.props}
                                                class="flex-1"
                                                label="Repetições"
                                                value={field.value}
                                                error={field.error}
                                            />
                                        )}
                                    </Field>

                                    <Field of={form} name={`${array.name}.${index()}.videoUrl`}>
                                        {(field) => (
                                            <TextInput
                                                {...field.props}
                                                class="flex-1"
                                                label="Vídeo"
                                                value={field.value}
                                                error={field.error}
                                            />
                                        )}
                                    </Field>

                                    <div class="flex gap-6 items-start">
                                        <Field of={form} name={`${array.name}.${index()}.weight.type`}>
                                            {(field) => (
                                                <div class="flex flex-1 flex-col">
                                                    <label class="text-sm mb-2">Tipo de carga</label>
                                                    <select class="input" {...field.props}>
                                                        <For each={weightTypes}>
                                                            {(item) => (
                                                                <option
                                                                    value={item.key}
                                                                    selected={field.value === item.key}
                                                                >
                                                                    {item.label}
                                                                </option>
                                                            )}
                                                        </For>
                                                    </select>
                                                </div>
                                            )}
                                        </Field>
                                        <Show when={getValue(form, `${array.name}.${index()}.weight.type`) !== 'none'}>
                                            <Field of={form} name={`${array.name}.${index()}.weight.value`}>
                                                {(field) => (
                                                    <TextInput
                                                        {...field.props}
                                                        class="flex-1"
                                                        label="Peso"
                                                        value={field.value}
                                                        error={field.error}
                                                    />
                                                )}
                                            </Field>
                                        </Show>
                                    </div>
                                    <button
                                        class="btn btn-light self-end"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            remove(form, 'movements', { at: index() })
                                        }}
                                    >
                                        Remover
                                    </button>
                                </div>
                            )}
                        </For>
                    )}
                </FieldArray>

                <button class="btn self-end" onClick={handleClickAddMovement}>
                    Adicionar 1 movimento
                </button>
            </Show>

            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default RoundForm
