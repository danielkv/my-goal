import { IEventBlock } from 'goal-models'
import {
    blockTimerType,
    checkIsTimedWorkout,
    eventBlockDisplay,
    isRestRound,
    movementDisplay,
    numberHelper,
    roundDisplay,
    roundTimerType,
} from 'goal-utils'
import { FiYoutube } from 'solid-icons/fi'
import { RiSystemTimerLine } from 'solid-icons/ri'

import { Component, For, Show, createMemo } from 'solid-js'

import { WorksheetPeace } from '@interfaces/preview'
import { Stack } from '@suid/material'
import { addToPath } from '@utils/paths'
import { createEventRoundValues } from '@utils/worksheetInitials'
import PeaceControl from '@view/WorksheetFormScreen/WorksheetWeekV2/components/PeaceControl'

export interface EventBlockPreviewProps extends WorksheetPeace<IEventBlock> {}

const EventBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    const eventTitle = createMemo(() => eventBlockDisplay.displayHeader(props.item))

    const timedWorkoutMode = createMemo(() => checkIsTimedWorkout(props.item))
    const timerType = createMemo(() => blockTimerType(props.item))

    return (
        <Stack>
            {(!!props.item.name || !!eventTitle() || timedWorkoutMode() === 'block' || !!timerType()) && (
                <Stack direction="row" class="items-center mt-1 mb-1.5 gap-1">
                    <div class="text-sm">{eventTitle() || props.item.name || 'Clique para abrir o Timer'}</div>
                    {(timedWorkoutMode() === 'block' || !!timerType()) && <RiSystemTimerLine />}
                </Stack>
            )}

            <Stack class="bg-gray-800 rounded-xl text-sm">
                <For each={props.item.rounds}>
                    {(round, roundIndex) => {
                        const roundPath = createMemo(() =>
                            addToPath<IEventBlock>(props.thisPath, `rounds.${roundIndex()}`)
                        )

                        const matchSequenceReps = createMemo(() =>
                            !isRestRound(round) ? numberHelper.findSequenceReps(round.movements) : null
                        )

                        const roundTitle = createMemo(() => roundDisplay.displayHeader(round, matchSequenceReps()))

                        const timerType = createMemo(() => roundTimerType(round))

                        return (
                            <div
                                class="mx-1 p-2 round rounded-xl"
                                classList={{
                                    selected: props.currentPath === roundPath(),
                                    empty: !isRestRound(round) && !round.movements.length,
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
                                        {!timedWorkoutMode() && timerType() && <RiSystemTimerLine />}
                                    </Stack>
                                </Show>

                                <Show when={round.type == 'complex'}>
                                    <div class="movement">{roundDisplay.display(round)}</div>
                                </Show>

                                <Show
                                    when={!['rest', 'complex'].includes((!isRestRound(round) && round.type) as string)}
                                >
                                    <For each={!isRestRound(round) && round.movements}>
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
                            </div>
                        )
                    }}
                </For>
            </Stack>
        </Stack>
    )
}

export default EventBlockPreview
