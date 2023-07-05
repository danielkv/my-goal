import { useMemo } from 'react'

import { IRound } from 'goal-models'
import { isComplexRound, isRestRound, numberHelper, roundTimerType } from 'goal-utils'
import { roundDisplay } from 'goal-utils'
import { Stack, Text, XStack, YStack } from 'tamagui'

import EventBlockMovement from '@components/EventBlockMovement'
import OpenTimerButton from '@components/OpenTimerButton'
import { Timer } from '@tamagui/lucide-icons'

export interface EventBlockRoundProps {
    round: IRound
    showTimerButton?: boolean
}

const EventBlockRound: React.FC<EventBlockRoundProps> = ({ round, showTimerButton = false }) => {
    const sequenceReps = useMemo(() => numberHelper.findSequenceReps(!isRestRound(round) ? round.movements : []), [])

    const roundHeader = roundDisplay.displayHeader(round, sequenceReps)
    const timerType = roundTimerType(round)

    return (
        <OpenTimerButton round={round} disabled={!showTimerButton} type={timerType}>
            <Stack>
                {!!roundHeader && (
                    <XStack gap="$1" ai="center" mb="$1.5">
                        <Text fontWeight="bold" fontSize="$4">
                            {roundHeader}
                        </Text>
                        {showTimerButton && timerType && <Timer size={14} color="white" />}
                    </XStack>
                )}

                {!isRestRound(round) && !isComplexRound(round) ? (
                    <YStack ai="flex-start">
                        {round.movements.map((movement, index) => (
                            <EventBlockMovement
                                key={`${movement.name}.${index}`}
                                hideReps={!!sequenceReps}
                                movement={movement}
                            />
                        ))}
                    </YStack>
                ) : (
                    isComplexRound(round) && (
                        <Text textBreakStrategy="balanced" fontSize="$4" color="$gray3">
                            {roundDisplay.display(round)}
                        </Text>
                    )
                )}
            </Stack>
        </OpenTimerButton>
    )
}

export default EventBlockRound
