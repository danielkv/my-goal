import dayjs from 'dayjs'
import { IWorksheet } from 'goal-models'

import { Component, For, createMemo, splitProps } from 'solid-js'

import { Path } from '@interfaces/app'
import { WorksheetPeace } from '@interfaces/preview'

import DayPreview from './day'

export interface WorksheetPreviewProps extends Omit<WorksheetPeace<IWorksheet>, 'thisPath'> {}

const WorksheetPreview: Component<WorksheetPreviewProps> = (props) => {
    const [parentProps] = splitProps(props, ['currentPath', 'onAdd', 'onRemove', 'onMove', 'onUpdate', 'onClickPeace'])

    return (
        <div class="worksheet">
            <h1
                class="text-xl font-bold m-2 p-2"
                classList={{
                    selected: props.currentPath === 'worksheet',
                    hoverable: !!props.onClickPeace,
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    props.onClickPeace?.(`worksheet`)
                }}
            >
                {props.item.name} - Início: {dayjs(props.item.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}
            </h1>
            {props.item.info && <div>{props.item.info}</div>}
            <For each={props.item.days}>
                {(day, dayIndex) => {
                    const dayPath = createMemo<Path>(() => `worksheet.days.${dayIndex()}`)

                    return <DayPreview item={day} thisPath={dayPath()} {...parentProps} />
                }}
            </For>
        </div>
    )
}

export default WorksheetPreview
