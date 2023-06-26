import { useMemo, useState } from 'react'

import Button from '@components/Button'
import EventBlockRound from '@components/EventBlockRound'
import InternalCard from '@components/InternalCard'
import OpenTimerButton from '@components/OpenTimerButton'
import TimerIcon from '@components/TimerIcon'
import { IEventBlock } from '@models/block'
import { useNavigation } from '@react-navigation/native'
import { blockTimerType, checkIsTimedWorkout } from '@utils/timer-display'
import { eventBlockTransformer } from '@utils/transformer/eventblock'

import { AlertDialog, Text, YStack } from 'tamagui'
import { XStack } from 'tamagui'

export interface PeriodEventBlock {
    block: IEventBlock
}

const EventBlock: React.FC<PeriodEventBlock> = ({ block }) => {
    const blockTitle = eventBlockTransformer.displayTitle(block)
    const [infoOpen, setInfoOpen] = useState(false)

    const isTimedWorkout = useMemo(() => checkIsTimedWorkout(block), [])
    const timerType = blockTimerType(block)

    const handleCloseInfo = () => {
        setInfoOpen(false)
    }
    const handleOpenInfo = () => {
        setInfoOpen(true)
    }

    return (
        <OpenTimerButton block={block}>
            {(!!block.name || !!blockTitle || !!isTimedWorkout || !!timerType) && (
                <XStack ai="center" mt="$1" mb="$1.5" gap="$1">
                    <Text fontWeight="bold" fontSize="$4">
                        {blockTitle || block.name || 'Clique para abrir o Timer'}
                    </Text>
                    {(!!isTimedWorkout || !!timerType) && (
                        <TimerIcon name={timerType || 'for_time'} size={14} color="white" />
                    )}
                </XStack>
            )}

            <InternalCard>
                {block.rounds.map((round, index) => (
                    <EventBlockRound key={`${round.type}${index}`} round={round} showTimerButton={!isTimedWorkout} />
                ))}
            </InternalCard>

            <AlertDialog open={infoOpen}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay
                        key="overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                    <AlertDialog.Content
                        bordered
                        elevate
                        key="content"
                        animation={[
                            'quick',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                        enterStyle={{ x: 0, y: -20, opacity: 0 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0 }}
                        opacity={1}
                        w="90%"
                        x={0}
                        y={0}
                    >
                        <YStack space>
                            <AlertDialog.Title>Informações</AlertDialog.Title>
                            <AlertDialog.Description>{block.info}</AlertDialog.Description>

                            <XStack space="$3" justifyContent="flex-end">
                                <AlertDialog.Action asChild>
                                    <Button theme="active" onPress={handleCloseInfo}>
                                        OK
                                    </Button>
                                </AlertDialog.Action>
                            </XStack>
                        </YStack>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog>
        </OpenTimerButton>
    )
}

export default EventBlock
