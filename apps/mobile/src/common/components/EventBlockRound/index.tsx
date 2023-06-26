import { useMemo } from 'react'

import EventBlockMovement from '@components/EventBlockMovement'
import OpenTimerButton from '@components/OpenTimerButton'
import { IRound } from '@models/block'
import { Timer } from '@tamagui/lucide-icons'
import { roundTimerType } from '@utils/timer-display'
import { roundTransformer } from '@utils/transformer/round'

import { Stack, Text, XStack, YStack } from 'tamagui'

export interface EventBlockRoundProps {
    round: IRound
    showTimerButton?: boolean
}

const EventBlockRound: React.FC<EventBlockRoundProps> = ({ round, showTimerButton = false }) => {
    const sequenceReps = useMemo(() => roundTransformer.findSequenceReps(round.movements), [])

    const roundTitle = roundTransformer.displayTitle(round, sequenceReps?.join('-'))

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
                ) : round.type === 'complex' ? (
                    <Text textBreakStrategy="balanced" fontSize="$4" color="$gray3">
                        {roundTransformer.displayComplex(round)}
                    </Text>
                ) : (
                    <Text textBreakStrategy="balanced" fontWeight="bold" fontSize="$4">
                        {roundTransformer.displayRestRound(round)}
                    </Text>
                )}
            </Stack>
        </OpenTimerButton>
    )
}

export default EventBlockRound
