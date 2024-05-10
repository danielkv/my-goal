import { Component, For } from 'solid-js'
import { createSignal } from 'solid-js'

import { Field, FieldArray } from '@modular-forms/solid'
import { Stack } from '@suid/material'
import { FileArrayPath, IWorksheetFormCommon } from '@view/WorksheetFormScreen/WorksheetWeekV2/types'

import styles from '../../styles.module.css'

import DayPeace from './day'

interface WorksheetPeaceProps extends IWorksheetFormCommon {}

const WorksheetPeace: Component<WorksheetPeaceProps> = (props) => {
    const [selected, setSelected] = createSignal<FileArrayPath | null>(null)

    return (
        <div class={`worksheet ${styles.worksheetV2}`}>
            <h1 class="text-xl font-bold m-2 p-2">
                <Stack direction="row" gap={3}>
                    <Field of={props.form} name="name">
                        {(field, props) => (
                            <input
                                classList={{ [styles.worksheetInput]: true }}
                                class="text-center"
                                value={field.value}
                                {...props}
                            />
                        )}
                    </Field>
                </Stack>
            </h1>
            <div>
                <FieldArray of={props.form} name="days">
                    {(arrayProps) => (
                        <For each={arrayProps.items}>
                            {(_, index) => (
                                <DayPeace
                                    selectedPath={selected()}
                                    setSelectedPath={setSelected}
                                    form={props.form}
                                    arrProps={arrayProps}
                                    index={index()}
                                />
                            )}
                        </For>
                    )}
                </FieldArray>
            </div>
        </div>
    )
}

export default WorksheetPeace
