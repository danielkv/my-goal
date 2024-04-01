import dayjs from 'dayjs'
import { capitalize } from 'radash'

import { Component, For } from 'solid-js'
import { createMemo } from 'solid-js'

import { FieldArray, getValue } from '@modular-forms/solid'
import { Stack } from '@suid/material'
import { IWorksheetArrayFormCommon } from '@view/NewWorksheet/types'

import PeaceControl from '../PeaceControl'

import SectionPreview from './section'

export interface PeriodProps extends IWorksheetArrayFormCommon<`days.${number}.periods`> {}

const PeriodPreview: Component<PeriodProps> = (props) => {
    const dayDate = createMemo(() => {
        const path = props.arrProps.name.split('.')
        path.pop()
        const dayDatePath = path.join('.') as `days.${number}`

        const dateValue = getValue(props.form, `${dayDatePath}.date`)
        const dateDjs = dayjs(dateValue, 'YYYY-MM-DD')

        if (!dateDjs.isValid()) return ''

        return capitalize(dateDjs.format('ddd[.] DD/MM/YYYY'))
    })

    return (
        <div
            class="period bg-gray-900 rounded-xl w-96 selectable"
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

            <Stack flexDirection="row" class="header items-center justify-between">
                <Stack class="period-square bg-red-500 w-12 h-12 rounded-tl-xl rounded-br-xl items-center justify-center font-bold text-xl">
                    {props.index + 1}
                </Stack>

                <Stack class="text-right em:mr-6 font-bold text-sm">{dayDate()}</Stack>
            </Stack>
            <Stack>
                <FieldArray of={props.form} name={`${props.arrProps.name}.${props.index}.sections`}>
                    {(arrProps) => (
                        <For each={arrProps.items}>
                            {(_, index) => (
                                <SectionPreview
                                    selectedPath={props.selectedPath}
                                    setSelectedPath={props.setSelectedPath}
                                    form={props.form}
                                    arrProps={arrProps}
                                    index={index()}
                                    periodNumber={props.index}
                                />
                            )}
                        </For>
                    )}
                </FieldArray>
            </Stack>
        </div>
    )
}

export default PeriodPreview
