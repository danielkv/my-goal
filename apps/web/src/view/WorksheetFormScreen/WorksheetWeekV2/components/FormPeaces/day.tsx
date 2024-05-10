import { Component, For } from 'solid-js'

import { Field, FieldArray } from '@modular-forms/solid'
import { Stack } from '@suid/material'
import { IWorksheetArrayFormCommon } from '@view/WorksheetFormScreen/WorksheetWeekV2/types'

import styles from '../../styles.module.css'
import PeaceControl from '../PeaceControl'

import PeriodPreview from './period'

export interface DayProps extends IWorksheetArrayFormCommon<'days'> {}

const DayPeace: Component<DayProps> = (props) => {
    return (
        <div
            class="day p-8 rounded-xl selectable"
            classList={{ selected: props.selectedPath === `${props.arrProps.name}.${props.index}` }}
            onClick={(e) => {
                e.stopPropagation()
                props.setSelectedPath(`${props.arrProps.name}.${props.index}`)
            }}
        >
            <PeaceControl
                selectedPath={props.selectedPath}
                setSelectedPath={props.setSelectedPath}
                arrProps={props.arrProps}
                form={props.form}
                index={props.index}
            />

            <div class="title text-center mb-6">
                <Field of={props.form} name={`${props.arrProps.name}.${props.index}.date`}>
                    {(field, fieldProps) => (
                        <input class={styles.worksheetInput} type="date" value={field.value || ''} {...fieldProps} />
                    )}
                </Field>
            </div>

            <Stack class="gap-4">
                <FieldArray of={props.form} name={`${props.arrProps.name}.${props.index}.periods`}>
                    {(arrProps) => (
                        <For each={arrProps.items}>
                            {(_, index) => (
                                <PeriodPreview
                                    selectedPath={props.selectedPath}
                                    setSelectedPath={props.setSelectedPath}
                                    form={props.form}
                                    arrProps={arrProps}
                                    index={index()}
                                />
                            )}
                        </For>
                    )}
                </FieldArray>
            </Stack>
        </div>
    )
}

export default DayPeace
