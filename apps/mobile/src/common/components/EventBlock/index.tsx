import { useMemo } from 'react'

import { IEventBlock } from 'goal-models'
import { blockTimerType, checkIsTimedWorkout } from 'goal-utils'
import { eventBlockDisplay } from 'goal-utils'
import { Text, XStack } from 'tamagui'

import EventBlockRound from '@components/EventBlockRound'
import InternalCard from '@components/InternalCard'
import OpenTimerButton from '@components/OpenTimerButton'
import TimerIcon from '@components/TimerIcon'

export interface PeriodEventBlock {
    block: IEventBlock
}

const EventBlock: React.FC<PeriodEventBlock> = ({ block }) => {
    const blockHeader = eventBlockDisplay.displayHeader(block)

    const isTimedWorkout = useMemo(() => checkIsTimedWorkout(block), [])
    const timerType = blockTimerType(block)

    return (
        <OpenTimerButton block={block} timedWorkoutMode={isTimedWorkout} type={timerType}>
            {(!!block.name || !!blockHeader || isTimedWorkout === 'block' || !!timerType) && (
                <XStack ai="center" mt="$1" mb="$1.5" gap="$1">
                    <Text fontWeight="bold" fontSize="$4">
                        {blockHeader || block.name || 'Clique para abrir o Timer'}
                    </Text>
                    {(isTimedWorkout === 'block' || !!timerType) && (
                        <TimerIcon name={timerType || 'for_time'} size={14} color="white" />
                    )}
                </XStack>
            )}

            <InternalCard>
                {block.rounds.map((round, index) => (
                    <EventBlockRound
                        key={`${round.type}${index}`}
                        round={round}
                        showTimerButton={isTimedWorkout === 'round'}
                    />
                ))}
            </InternalCard>
        </OpenTimerButton>
    )
}

export default EventBlock
