import { FiYoutube } from 'solid-icons/fi'
import { RiSystemTimerLine } from 'solid-icons/ri'

import { Component, For, Show, createMemo } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { IEventBlock } from '@models/block'
import { Stack } from '@suid/material'
import { eventBlockDisplay } from '@utils/display/eventBlock'
import { movementDisplay } from '@utils/display/movement'
import { roundDisplay } from '@utils/display/round'
import { numberHelper } from '@utils/numbers'
import { addToPath } from '@utils/paths'
import { blockTimerType, checkIsTimedWorkout, roundTimerType } from '@utils/timer-display'
import { createEventRoundValues } from '@utils/worksheetInitials'

export interface EventBlockPreviewProps extends WorksheetPeace<IEventBlock> {}

const EventBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    const eventTitle = createMemo(() => eventBlockDisplay.displayHeader(props.item))

    const isTimedWorkout = createMemo(() => checkIsTimedWorkout(props.item))
    const timerType = createMemo(() => blockTimerType(props.item))

    return (
        <Stack>
            {(!!props.item.name || !!eventTitle() || !!isTimedWorkout() || !!timerType()) && (
                <Stack direction="row" class="items-center mt-1 mb-1.5 gap-1">
                    <div class="text-sm">{eventTitle() || props.item.name || 'Clique para abrir o Timer'}</div>
                    {(!!isTimedWorkout() || !!timerType()) && <RiSystemTimerLine />}
                </Stack>
            )}

            <Stack class="bg-gray-800 rounded-xl text-sm">
                <For each={props.item.rounds}>
                    {(round, roundIndex) => {
                        const roundPath = createMemo(() =>
                            addToPath<IEventBlock>(props.thisPath, `rounds.${roundIndex()}`)
                        )

                        const matchSequenceReps = createMemo(() => numberHelper.findSequenceReps(round.movements))

                        const roundTitle = createMemo(() => roundDisplay.displayHeader(round, matchSequenceReps()))

                        const timerType = createMemo(() => roundTimerType(round))

                        return (
                            <Stack
                                class="mx-1 p-2 round rounded-xl"
                                classList={{
                                    selected: props.currentPath === roundPath(),
                                    empty: !round.movements.length,
                                    hoverable: !!props.onClickPeace,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    props.onClickPeace?.(roundPath())
                                }}
                            >
                                {props.onAdd && props.onRemove && props.onMove && (
                                    <PeaceControl
                                        onAdd={props.onAdd}
                                        onRemove={props.onRemove}
                                        onMove={props.onMove}
                                        item={round}
                                        thisPath={roundPath()}
                                        createInitialValues={createEventRoundValues}
                                    />
                                )}
                                <Show when={!!roundTitle()}>
                                    <Stack direction="row" class="gap-1 items-center">
                                        <div class="title font-bold">{roundTitle()}</div>
                                        {!isTimedWorkout() && timerType() && <RiSystemTimerLine />}
                                    </Stack>
                                </Show>

                                <Show when={round.type == 'rest'}>
                                    <div class="font-bold text-sm">{roundDisplay.display(round)}</div>
                                </Show>
                                <Show when={round.type == 'complex'}>
                                    <div class="movement">{roundDisplay.display(round)}</div>
                                </Show>
                                <Show when={!['rest', 'complex'].includes(round.type)}>
                                    <For each={round.movements}>
                                        {(movement) => {
                                            const displayMovement = movementDisplay.display(
                                                movement,
                                                !!matchSequenceReps()
                                            )

                                            return (
                                                <Stack flexDirection="row" class="items-center movement gap-2">
                                                    <div>{displayMovement}</div>
                                                    {movement.videoUrl && (
                                                        <div class=" rounded-full bg-gray-900 p-1.5">
                                                            <FiYoutube size={14} />
                                                        </div>
                                                    )}
                                                </Stack>
                                            )
                                        }}
                                    </For>
                                </Show>
                            </Stack>
                        )
                    }}
                </For>
            </Stack>
        </Stack>
    )
}

export default EventBlockPreview
