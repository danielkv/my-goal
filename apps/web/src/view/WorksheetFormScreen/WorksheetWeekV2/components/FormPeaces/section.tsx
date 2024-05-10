import { Component, For } from 'solid-js'

import { Field, FieldArray } from '@modular-forms/solid'
import { Stack } from '@suid/material'
import { IWorksheetArrayFormCommon } from '@view/WorksheetFormScreen/WorksheetWeekV2/types'

import styles from '../../styles.module.css'
import PeaceControl from '../PeaceControl'

import BlockPeace from './block'

export interface SectionProps extends IWorksheetArrayFormCommon<`days.${number}.periods.${number}.sections`> {
    periodNumber: number
}

const SectionPreview: Component<SectionProps> = (props) => {
    return (
        <div
            class="section rounded-xl p-2 selectable"
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
            <Stack
                flexDirection="row"
                class="font-bold justify-center items-center gap-4 text-center text-sm mb-2 uppercase"
            >
                <div>
                    {props.periodNumber + 1}.{props.index + 1}
                </div>
                <Field of={props.form} name={`${props.arrProps.name}.${props.index}.name`}>
                    {(field, fieldProps) => (
                        <input class={`${styles.worksheetInput} text-center`} value={field.value} {...fieldProps} />
                    )}
                </Field>
            </Stack>

            <FieldArray of={props.form} name={`${props.arrProps.name}.${props.index}.blocks`}>
                {(arrProps) => (
                    <For each={arrProps.items}>
                        {(_, index) => (
                            <BlockPeace
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
        </div>
    )
}

export default SectionPreview
