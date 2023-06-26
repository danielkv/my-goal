import { useCallback, useState } from 'react'
import { SvgProps } from 'react-native-svg'

import { TTimerType } from '@common/interfaces/timers'
import Button from '@components/Button'
import TextField from '@components/TextField'
import TimeField from '@components/TimeField'
import { Edit2 } from '@tamagui/lucide-icons'

import { H2, Input, Sheet, Stack, Text, XStack, YStack } from 'tamagui'
import { useTheme } from 'tamagui'

export interface TabataFormProps {
    type: 'tabata'
    time2: number
    onChangeTime2: (value: number) => void
    rounds: number
    onChangeRounds: (value: number) => void
}

export interface EmomFormProps {
    type: 'emom'
    rounds: number
    onChangeRounds: (value: number) => void
}

export interface RegressiveFormProps {
    type: 'regressive'
}

export interface StopwatchFormProps {
    type: 'stopwatch'
}

type TimerFormProps = {
    Icon: React.FC<SvgProps>
    time1: number
    onChangeTime1: (value: number) => void
    countdown: number
    onChangeCountdown: (value: number) => void
} & (TabataFormProps | EmomFormProps | RegressiveFormProps | StopwatchFormProps)

function getTime1Label(type: TTimerType): string {
    switch (type) {
        case 'tabata':
            return 'Work'
        case 'emom':
            return 'A cada'
        default:
            return 'Defina o tempo'
    }
}

const TimerForm: React.FC<TimerFormProps> = (props) => {
    const theme = useTheme()
    const [contdownDialogOpen, setupCountdownDialogOpen] = useState(false)

    const handleClose = useCallback(() => {
        setupCountdownDialogOpen(false)
    }, [])

    return (
        <YStack flex={1} ai="center" jc="center" gap="$5">
            <Stack>
                <props.Icon fill={theme.gray5.val} width={60} />
            </Stack>
            <XStack ai="center">
                <Text mr="$3" fontWeight="400" color="$gray4">
                    {props.countdown > 0 ? `Countdown ${props.countdown}s` : 'Sem countdown'}
                </Text>
                <Button circular onPress={() => setupCountdownDialogOpen(true)}>
                    <Edit2 color="$gray2" size={20} />
                </Button>
            </XStack>
            <YStack ai="center">
                <Text fontWeight="400" color="$gray4">
                    {getTime1Label(props.type)}
                </Text>
                <TimeField value={props.time1} onChange={(value) => props.onChangeTime1(value)} />
                {props.type === 'stopwatch' && (
                    <Text fontSize="$3" color="$gray5">
                        00:00 para indeterminado
                    </Text>
                )}
            </YStack>
            {props.type === 'tabata' && props.time2 !== undefined && !!props.onChangeTime2 && (
                <YStack ai="center">
                    <Text fontWeight="400" color="$gray4">
                        Rest
                    </Text>
                    <TimeField value={props.time2} onChange={(value) => props.onChangeTime2(value)} />
                </YStack>
            )}
            {(props.type === 'tabata' || props.type === 'emom') && (
                <YStack ai="center">
                    <Text fontWeight="400" color="$gray4">
                        Rounds
                    </Text>

                    <XStack alignItems="center" bg="$gray8" br="$4" p="$1">
                        <Input
                            unstyled
                            keyboardType="number-pad"
                            color="$gray2"
                            w={100}
                            style={{
                                textAlign: 'center',
                                fontSize: 60,
                                fontWeight: '700',
                            }}
                            maxLength={2}
                            value={String(props.rounds)}
                            onChangeText={(value) => props.onChangeRounds(Number(value))}
                        />
                    </XStack>
                </YStack>
            )}

            <Sheet
                unmountChildrenWhenHidden
                forceRemoveScrollEnabled={contdownDialogOpen}
                modal
                open={contdownDialogOpen}
                snapPoints={[85]}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="bouncy"
                onOpenChange={setupCountdownDialogOpen}
            >
                <Sheet.Overlay opacity={0.2} />
                <Sheet.Handle />
                <Sheet.Frame flex={1} padding="$4" gap="$5">
                    <H2 color="$gray1">Alterar countdown</H2>

                    <Stack gap="$2">
                        <TextField
                            autoFocus
                            label="Countdown"
                            keyboardType="number-pad"
                            value={String(props.countdown)}
                            onChangeText={(value) => props.onChangeCountdown(Number(value))}
                        />
                        <Text fontSize="$3" color="$gray3">
                            0 sem countdown
                        </Text>
                    </Stack>

                    <Button variant="primary" onPress={handleClose}>
                        OK
                    </Button>
                </Sheet.Frame>
            </Sheet>
        </YStack>
    )
}

export default TimerForm
