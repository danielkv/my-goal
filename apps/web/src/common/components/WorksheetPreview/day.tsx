import dayjs from 'dayjs'

import { Component, For, createMemo, splitProps } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { IDay } from '@models/day'
import { Stack } from '@suid/material'
import { addToPath } from '@utils/paths'
import { createDayValues } from '@utils/worksheetInitials'

import PeriodPreview from './period'

export interface DayProps extends WorksheetPeace<IDay> {}

const DayPreview: Component<DayProps> = (props) => {
    const [parentProps, controlProps] = splitProps(
        props,
        ['currentPath', 'onAdd', 'onRemove', 'onMove', 'onUpdate', 'onClickPeace'],
        ['onAdd', 'onRemove', 'onMove', 'item', 'thisPath']
    )

    return (
        <Stack
            class="day p-8 rounded-xl"
            classList={{
                selected: props.currentPath === props.thisPath,
                empty: !props.item.periods.length,
                hoverable: !!props.onClickPeace,
            }}
            onClick={(e) => {
                e.stopPropagation()
                props.onClickPeace?.(props.thisPath)
            }}
        >
            {props.onAdd && props.onRemove && props.onMove && (
                <PeaceControl
                    {...controlProps}
                    createInitialValues={createDayValues}
                    copyOnAddBottom={{
                        date: dayjs(props.item.date).add(1, 'day').format('YYYY-MM-DD'),
                        name: props.item.name,
                    }}
                    copyOnAddTop={{
                        date: dayjs(props.item.date).subtract(1, 'day').format('YYYY-MM-DD'),
                        name: props.item.name,
                    }}
                />
            )}

            <div class="title text-center mb-6">
                {dayjs(props.item.date, 'YYYY-MM-DD').format('ddd [-] DD/MM/YYYY').toLocaleUpperCase()}
            </div>

            <Stack class="gap-4">
                <For each={props.item.periods}>
                    {(period, periodIndex) => {
                        const periodPath = createMemo(() => addToPath<IDay>(props.thisPath, `periods.${periodIndex()}`))

                        return <PeriodPreview day={props.item} item={period} thisPath={periodPath()} {...parentProps} />
                    }}
                </For>
            </Stack>
        </Stack>
    )
}

export default DayPreview
