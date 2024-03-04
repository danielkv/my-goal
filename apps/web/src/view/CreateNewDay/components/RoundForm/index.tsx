import { IRestBlock, IRound } from 'goal-models'
import { isRestRound, roundTypes } from 'goal-utils'
import { omit } from 'radash'

import { Component, For, JSX, Show, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import TimeInput from '@components/TimeInput'
import TimersForm from '@components/TimersForm'
import { FieldArray, SubmitHandler, createForm, getValue, insert, remove, reset, zodForm } from '@modular-forms/solid'
import { createRoundMovementValues } from '@utils/worksheetInitials'

import { TRoundForm, eventRoundFormSchema, weightTypes } from './config'

export interface BlockFormProps {
    onClickNext(data: TRoundForm): void
    round: IRound
}

const RoundForm: Component<BlockFormProps> = (props) => {
    const [form, { Form, Field }] = createForm<TRoundForm>({
        validate: zodForm(eventRoundFormSchema),
        initialValues: props.round,
    })

    const memoData = createMemo(() => props.round)
    createEffect(
        on(memoData, () => {
            reset(form, { initialValues: memoData() })
        })
    )

    const handleSubmit: SubmitHandler<TRoundForm> = (round) => {
        const newValues = isRestRound(round)
            ? round
            : ({
                  ...round,
                  type: round.type || undefined,
                  config: {
                      ...round.config,
                      numberOfRounds: Number.isNaN(round.config.numberOfRounds) ? 1 : round.config.numberOfRounds || 1,
                  },
                  movements:
                      round.movements?.map((mov) => {
                          if (!mov.weight || mov.weight?.type === 'none') return omit(mov, ['weight'])
                          return mov
                      }) || [],
              } as Exclude<IRound, IRestBlock>)

        props.onClickNext(newValues)
    }

    const handleClickAddMovement: JSX.CustomEventHandlersCamelCase<HTMLButtonElement>['onClick'] = (e) => {
        e.preventDefault()

        // @ts-expect-error
        insert(form, 'movements', { value: [createRoundMovementValues()] })
    }

    return (
        <Form name="teste" class="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Field name="type">
                {(field, props) => {
                    const handleInput: JSX.EventHandler<HTMLSelectElement, InputEvent> = (e) => {
                        reset(form, { initialValues: { type: 'rest', time: 0 } })

                        props.onInput(e)
                    }
                    return (
                        <div class="flex flex-col flex-1 min-w-[100px]">
                            <label class="text-sm mb-2">Tipo de round</label>
                            <select class="input input-full" {...props} onInput={handleInput}>
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
                <Field name="time">
                    {(field, props) => (
                        <TimeInput {...props} class="flex-1" label="Tempo" value={field.value} error={field.error} />
                    )}
                </Field>
            </Show>

            <Show when={getValue(form, 'type') !== 'rest'}>
                {/* @ts-expect-error */}
                <TimersForm of={form} />

                <div class="section-title">Movimentos</div>
                <FieldArray of={form} name="movements">
                    {(array) => (
                        <For each={array.items}>
                            {(_, index) => (
                                <div class="paper flex flex-col gap-3">
                                    <Field name={`${array.name}.${index()}.name`}>
                                        {(field, props) => {
                                            return (
                                                <TextInput
                                                    {...props}
                                                    class="flex-1"
                                                    label="Nome"
                                                    value={field.value}
                                                    error={field.error}
                                                />
                                            )
                                        }}
                                    </Field>
                                    <Field name={`${array.name}.${index()}.reps`}>
                                        {(field, props) => (
                                            <TextInput
                                                {...props}
                                                class="flex-1"
                                                label="Repetições"
                                                value={field.value}
                                                error={field.error}
                                            />
                                        )}
                                    </Field>

                                    <Field name={`${array.name}.${index()}.videoUrl`}>
                                        {(field, props) => (
                                            <TextInput
                                                {...props}
                                                class="flex-1"
                                                label="Vídeo"
                                                value={field.value}
                                                error={field.error}
                                            />
                                        )}
                                    </Field>

                                    <div class="flex gap-6 items-start">
                                        <Field name={`${array.name}.${index()}.weight.type`}>
                                            {(field, props) => (
                                                <div class="flex flex-1 flex-col">
                                                    <label class="text-sm mb-2">Tipo de carga</label>
                                                    <select class="input" {...props}>
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
                                            <Field name={`${array.name}.${index()}.weight.value`}>
                                                {(field, props) => (
                                                    <TextInput
                                                        {...props}
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
