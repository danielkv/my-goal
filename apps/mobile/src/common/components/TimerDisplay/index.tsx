import { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { SvgProps } from 'react-native-svg'

import { useKeepAwake } from 'expo-keep-awake'
import * as ScreenOrientation from 'expo-screen-orientation'
import { IEventBlock, IRound } from 'goal-models'
import { AnimatePresence, ColorTokens, Stack, Text, XStack, YStack, useTheme } from 'tamagui'

import { useOrientation } from '@common/hooks/useOrientation'
import { TActivityStatus, TTimerStatus } from '@common/interfaces/timers'
import WodDialog from '@components/WodDialog'
import { useNavigation } from '@react-navigation/native'
import { Edit3, PauseCircle, PlayCircle, RotateCcw } from '@tamagui/lucide-icons'

export interface TimerDisplayProps {
    time: string
    Icon?: React.FC<SvgProps>
    roundNumber?: number | null
    totalRounds?: number | null
    activityStatus?: TActivityStatus | 'countdown' | null
    watchProgressStatus: TTimerStatus
    initialCountdown?: string | null
    onPressPlayButton: () => void
    onPressEditButton?: () => void
    onPressPauseButton: () => void
    onPressResetButton: () => void
    round?: IRound
    block?: IEventBlock
}

function getActivityColor(type: TActivityStatus | 'countdown'): ColorTokens {
    switch (type) {
        case 'countdown':
            return '$blue10Light'
        case 'rest':
            return '$red5'
        case 'work':
            return '$green10'
    }
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
    time,
    Icon,
    roundNumber,
    round,
    block,
    totalRounds,
    activityStatus,
    watchProgressStatus,
    initialCountdown,
    onPressPlayButton,
    onPressEditButton,
    onPressPauseButton,
    onPressResetButton,
}) => {
    const orientation = useOrientation()
    const isPortrait = orientation === 'portrait'
    const theme = useTheme()

    const navigation = useNavigation()

    useKeepAwake()

    useEffect(() => {
        ScreenOrientation.unlockAsync()

        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        }
    }, [])

    useEffect(() => {
        navigation.setOptions({ headerStyle: { backgroundColor: isPortrait ? theme.gray9.val : theme.gray7.val } })
    }, [isPortrait])

    return (
        <YStack flex={1} alignItems="center" justifyContent="center" gap="$3">
            <Stack gap="$6" flexDirection="row" alignItems="center" mb="$2">
                {activityStatus && (
                    <Stack animation="quick" bg={getActivityColor(activityStatus)} px="$2" py="$1" br="$3">
                        <Text fontSize="$5" fontWeight="700">
                            {activityStatus.toLocaleUpperCase()}
                        </Text>
                    </Stack>
                )}
                <AnimatePresence>
                    {(initialCountdown === undefined || initialCountdown === null) && roundNumber && (
                        <Stack
                            animation="quick"
                            key="round"
                            opacity={1}
                            exitStyle={{ opacity: 0 }}
                            enterStyle={{ opacity: 1 }}
                            flexDirection="row"
                            alignItems="center"
                            gap="$3"
                        >
                            <Text fontSize="$5" fontWeight="400" color="$gray4">
                                Round
                            </Text>

                            <Text fontSize="$10" fontWeight="700" color="$gray2">
                                {roundNumber}
                                {totalRounds ? ` / ${totalRounds}` : ''}
                            </Text>
                        </Stack>
                    )}
                </AnimatePresence>
            </Stack>

            <Stack flexDirection={isPortrait ? 'column' : 'row'} alignItems="center" gap={isPortrait ? '$4' : '$3'}>
                {Icon && (
                    <Stack>
                        <Icon fill={theme.gray5.val} width={isPortrait ? 60 : 48} />
                    </Stack>
                )}

                {initialCountdown ? (
                    <Text color={theme.red2.val} fontWeight="700" fontSize={isPortrait ? '$14' : '$15'}>
                        {initialCountdown}
                    </Text>
                ) : (
                    <Text color={theme.gray2.val} fontWeight="700" fontSize={isPortrait ? '$13' : '$14'}>
                        {time}
                    </Text>
                )}
            </Stack>

            {(initialCountdown === undefined || initialCountdown === null) && (
                <XStack mt={isPortrait ? 10 : 0} alignItems="center" gap="$5">
                    {watchProgressStatus === 'running' ? (
                        <>
                            <TouchableOpacity onPress={onPressPauseButton}>
                                <PauseCircle color="$gray5" size={isPortrait ? 75 : 65} />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {watchProgressStatus !== 'finished' && (
                                <TouchableOpacity onPress={() => onPressPlayButton()}>
                                    <PlayCircle color="$red5" size={isPortrait ? 75 : 65} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => onPressResetButton()}>
                                <RotateCcw color="$gray5" size={isPortrait ? 75 : 65} />
                            </TouchableOpacity>
                            {onPressEditButton && (
                                <TouchableOpacity onPress={onPressEditButton}>
                                    <Edit3 color="$gray5" size={isPortrait ? 50 : 40} />
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </XStack>
            )}
            <AnimatePresence>
                {watchProgressStatus === 'initial' && (
                    <Stack
                        position="absolute"
                        bg="#000000bb"
                        key="play"
                        top={0}
                        bottom={0}
                        right={0}
                        left={0}
                        alignItems="center"
                        justifyContent="center"
                        opacity={1}
                        animation="quick"
                        exitStyle={{ opacity: 0 }}
                    >
                        <TouchableOpacity onPress={() => onPressPlayButton()}>
                            <PlayCircle color="white" strokeWidth={2} size={100} />
                        </TouchableOpacity>
                    </Stack>
                )}
            </AnimatePresence>

            {block ? <WodDialog block={block} /> : !!round && <WodDialog round={round} />}
        </YStack>
    )
}

export default TimerDisplay
