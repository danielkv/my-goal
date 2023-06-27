import { useMemo } from 'react'

import { numberHelper, roundTimerType } from 'goal-utils'
import { roundDisplay } from 'goal-utils'
import { Stack, Text, XStack, YStack } from 'tamagui'

import EventBlockMovement from '@components/EventBlockMovement'
import OpenTimerButton from '@components/OpenTimerButton'
import { IRound } from '@models/block'
import { Timer } from '@tamagui/lucide-icons'

export interface EventBlockRoundProps {
    round: IRound
    showTimerButton?: boolean
}

const EventBlockRound: React.FC<EventBlockRoundProps> = ({ round, showTimerButton = false }) => {
    const sequenceReps = useMemo(() => numberHelper.findSequenceReps(round.movements), [])

    const roundTitle = roundDisplay.displayHeader(round, sequenceReps)

    const timerType = roundTimerType(round)

    return (
        <OpenTimerButton round={round} disabled={!showTimerButton}>
            <Stack>
                {!!roundTitle && (
                    <XStack gap="$1" ai="center" mb="$1.5">
                        <Text fontWeight="bold" fontSize="$4">
                            {roundTitle}
                        </Text>
                        {showTimerButton && timerType && <Timer size={14} color="white" />}
                    </XStack>
                )}

                {!['complex', 'rest'].includes(round.type) ? (
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
                    <Text textBreakStrategy="balanced" fontSize="$4" color="$gray3">
                        {roundDisplay.display(round)}
                    </Text>
                )}
            </Stack>
        </OpenTimerButton>
    )
}

export default EventBlockRound
