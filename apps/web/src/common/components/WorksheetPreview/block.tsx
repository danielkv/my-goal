import { IBlock, IEventBlock, IRestBlock, ITextBlock } from 'goal-models'

import { Component, Match, Switch, createMemo, splitProps } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { Stack } from '@suid/material'
import { createBlockValues } from '@utils/worksheetInitials'

import EventBlockPreview from './blocks/eventBlock'
import RestBlockPreview from './blocks/restBlock'
import TextBlockPreview from './blocks/textBlock'

export interface BlockProps extends WorksheetPeace<IBlock> {
    sectionNumber: number
    blockNumber: number
}

const BlockPreview: Component<BlockProps> = (props) => {
    const [parentProps, controlProps] = splitProps(
        props,
        ['currentPath', 'onAdd', 'onRemove', 'onMove', 'onUpdate', 'onClickPeace'],
        ['onAdd', 'onRemove', 'onMove', 'item', 'thisPath']
    )

    const isEmpty = createMemo(() => {
        if (props.item.type === 'event' && !props.item.rounds.length) return true
        if (props.item.type === 'rest' && !props.item.time) return true
        if (props.item.type === 'text' && !props.item.text) return true
        if (props.item.type === '') return true

        return false
    })

    return (
        <Stack
            class="block rounded-xl p-2"
            classList={{
                selected: props.currentPath === props.thisPath,
                empty: isEmpty(),
                hoverable: !!props.onClickPeace,
            }}
            onClick={(e) => {
                e.stopPropagation()
                props.onClickPeace?.(props.thisPath)
            }}
        >
            {props.onAdd && props.onRemove && props.onMove && (
                <PeaceControl {...controlProps} createInitialValues={createBlockValues} />
            )}

            <Switch>
                <Match when={props.item.type === 'rest'}>
                    <RestBlockPreview item={props.item as IRestBlock} thisPath={props.thisPath} />
                </Match>
                <Match when={props.item.type === 'text'}>
                    <TextBlockPreview item={props.item as ITextBlock} thisPath={props.thisPath} />
                </Match>
                <Match when={props.item.type === 'event'}>
                    <EventBlockPreview item={props.item as IEventBlock} thisPath={props.thisPath} {...parentProps} />
                </Match>
            </Switch>
        </Stack>
    )
}

export default BlockPreview
