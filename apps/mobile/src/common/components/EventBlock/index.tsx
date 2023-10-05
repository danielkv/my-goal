import { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'

import { IEventBlock } from 'goal-models'
import { blockTimerType, checkIsTimedWorkout } from 'goal-utils'
import { eventBlockDisplay } from 'goal-utils'
import { Text, XStack } from 'tamagui'

import EventBlockRound from '@components/EventBlockRound'
import InternalCard from '@components/InternalCard'
import TimerIcon from '@components/TimerIcon'

export interface PeriodEventBlock {
    block: IEventBlock
    disableButton?: boolean
    onPress?(block: IEventBlock): void
}

const EventBlock: React.FC<PeriodEventBlock> = ({ block, disableButton, onPress }) => {
    const blockHeader = eventBlockDisplay.displayHeader(block)

    const blockTimerMode = useMemo(() => checkIsTimedWorkout(block), [])
    const timerType = blockTimerType(block)

    const handleOnPress = () => {
        if (!onPress) return

        onPress(block)
    }

    return (
        <TouchableOpacity onPress={handleOnPress} disabled={disableButton}>
            {(!!block.name || !!blockHeader || blockTimerMode === 'block' || !!timerType) && (
                <XStack ai="center" mt="$1" mb="$1.5" gap="$1">
                    <Text fontWeight="bold" fontSize="$4">
                        {blockHeader || block.name || 'Clique para abrir o Timer'}
                    </Text>
                    {(blockTimerMode === 'block' || !!timerType) && (
                        <TimerIcon name={timerType || 'for_time'} size={14} color="white" />
                    )}
                </XStack>
            )}

            <InternalCard>
                {block.rounds.map((round, index) => (
                    <EventBlockRound
                        key={`${round.type}${index}`}
                        round={round}
                        showTimerButton={blockTimerMode === 'round'}
                    />
                ))}
            </InternalCard>
        </TouchableOpacity>
    )
}

export default EventBlock
