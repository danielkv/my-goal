import dayjs from 'dayjs'
import { IDayInput, IPeriod } from 'goal-models'
import { capitalize } from 'radash'

import { Component, For, createMemo, splitProps } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { Stack } from '@suid/material'
import { addToPath, getLastIndex } from '@utils/paths'
import { createPeriodValues } from '@utils/worksheetInitials'

import SectionPreview from './section'

export interface PeriodProps extends WorksheetPeace<IPeriod> {
    day: IDayInput
}

const PeriodPreview: Component<PeriodProps> = (props) => {
    const [parentProps, controlProps] = splitProps(
        props,
        ['currentPath', 'onAdd', 'onRemove', 'onMove', 'onUpdate', 'onClickPeace'],
        ['onAdd', 'onRemove', 'onMove', 'item', 'thisPath']
    )

    return (
        <div
            class="period bg-gray-900 rounded-xl w-96"
            classList={{
                selected: props.currentPath === props.thisPath,
                empty: !props.item.sections?.length,
                hoverable: !!props.onClickPeace,
            }}
            onClick={(e) => {
                e.stopPropagation()
                props.onClickPeace?.(props.thisPath)
            }}
        >
            {props.onAdd && props.onRemove && props.onMove && (
                <PeaceControl {...controlProps} createInitialValues={createPeriodValues} />
            )}

            <Stack flexDirection="row" class="header items-center justify-between">
                <Stack class="period-square bg-red-500 w-12 h-12 rounded-tl-xl rounded-br-xl items-center justify-center font-bold text-xl">
                    {getLastIndex(props.thisPath) + 1}
                </Stack>

                <Stack class="text-right em:mr-6 font-bold text-sm">
                    {capitalize(dayjs(props.day.date, 'YYYY-MM-DD').format('ddd[.] DD/MM/YYYY'))}
                </Stack>
            </Stack>
            <Stack class="p-2">
                <For each={props.item.sections}>
                    {(section, sectionIndex) => {
                        const sectionPath = createMemo(() =>
                            addToPath<IPeriod>(props.thisPath, `sections.${sectionIndex()}`)
                        )

                        return (
                            <SectionPreview
                                item={section}
                                thisPath={sectionPath()}
                                sectionNumber={sectionIndex() + 1}
                                periodNumber={getLastIndex(props.thisPath) + 1}
                                {...parentProps}
                            />
                        )
                    }}
                </For>
            </Stack>
        </div>
    )
}

export default PeriodPreview
