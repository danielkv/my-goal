import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import dayjs from 'dayjs'
import { IEventBlock, IRound } from 'goal-models'
import { Stack, YStack } from 'tamagui'

import { useOrientation } from '@common/hooks/useOrientation'
import { TActivityStatus, TTimerStatus } from '@common/interfaces/timers'
import Button from '@components/Button'
import TimerDisplay from '@components/TimerDisplay'
import { useTimerSounds } from '@contexts/timers/useTimerSounds'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { EmomTimer, RegressiveTimer, StopwatchTimer, TabataTimer } from '@utils/timer'

import RoundDisplay from './RoundDisplay'

function flattenRounds(block: IEventBlock): IRound[] {
    const flattened = Array.from({ length: block.numberOfRounds || 1 }).flatMap(() =>
        block.rounds.map((round) => round)
    )

    if (flattened.at(-1)?.type === 'rest') flattened.splice(-1, 1)

    return flattened
}

const COUNTDOWN = 3

const WodTimerScreen: React.FC = () => {
    const {
        params: { block },
    } = useRoute<RouteProp<TReactNavigationStackParamList, 'WodTimer'>>()

    const orientation = useOrientation()
    const isPortrait = orientation === 'portrait'
    const navigation = useNavigation()

    const sounds = useTimerSounds()

    const [currentRoundDisplay, setCurrentRoundDisplay] = useState<number | null>(null)
    const [totalRounds, setTotalRounds] = useState<number | null>(null)
    const [activityStatus, setActivityStatus] = useState<'work' | 'rest' | 'countdown' | null>(null)
    const [currentStatus, setCurrentStatus] = useState<TTimerStatus>('initial')
    const [currentCountdown, setCurrentCountdown] = useState<number | null>(null)
    const [currentTime, setCurrentTime] = useState<number>(0)

    const rounds = useMemo(() => flattenRounds(block), [])

    const [selectedRound, setSelectedRound] = useState(0)

    const clockRef = useRef<StopwatchTimer>()
    const countdownTimerRef = useRef<StopwatchTimer>()

    function startClock(round?: number) {
        if (currentStatus === 'initial') setupTimer()

        if (round === 0 && currentStatus === 'initial') {
            setCurrentStatus('running')
            setActivityStatus('countdown')

            const countdownTimer = setupCountdown(COUNTDOWN)
            countdownTimer.start()

            countdownTimer.on('tick', (time: number) => {
                if (time === 0) {
                    countdownTimer.stop()
                    setCurrentCountdown(null)
                    clockRef.current?.start()
                    sounds.playStart()
                    setActivityStatus('work')
                }
            })
            return
        }

        clockRef.current?.start()
    }

    function setupTimer() {
        clockRef.current?.on('changeStatus', (status) => {
            setCurrentStatus(status)
        })

        clockRef.current?.on('tick', (duration: number, _, __, remaining: number) => {
            if (remaining <= 3) {
                if (remaining > 0) sounds.playBeep()
                else if (remaining === 0) sounds.playStart()
            }

            setCurrentTime(duration)
        })

        clockRef.current?.on('start', (duration: number) => {
            setCurrentTime(duration)
        })

        clockRef.current?.on('reset', () => {
            setCurrentStatus('initial')
        })

        return clockRef.current
    }

    function setupCountdown(countdown: number) {
        setCurrentCountdown(() => countdown)

        countdownTimerRef.current = new RegressiveTimer(countdown)

        countdownTimerRef.current.once('start', () => {
            sounds.playBeep()
        })

        countdownTimerRef.current.on('tick', (displayTime: number) => {
            setCurrentCountdown((prev) => {
                if (displayTime > 0 && displayTime != prev) sounds.playBeep()

                return displayTime
            })
        })

        return countdownTimerRef.current
    }

    function endAllRounds() {
        setCurrentTime(0)
        sounds.playFinish()
    }

    function nextTimer(currRound: number) {
        clockRef.current?.stop()

        const nextRound = currRound + 1

        if (nextRound >= rounds.length) {
            endAllRounds()
            return
        }

        setSelectedRound(nextRound)

        setupNewTimer(nextRound)

        startClock(nextRound)
    }

    function setupNewTimer(currRound: number) {
        const round = rounds[currRound]

        setCurrentRoundDisplay(null)

        setActivityStatus('work')

        switch (round.type) {
            case 'amrap':
                clockRef.current = new RegressiveTimer(round.timecap)

                break
            case 'for_time':
                clockRef.current = new StopwatchTimer(round.timecap)
                break
            case 'rest':
                clockRef.current = new RegressiveTimer(round.time)

                setActivityStatus('rest')
                break
            case 'emom':
                clockRef.current = new EmomTimer(round.each, round.numberOfRounds)
                if (round.numberOfRounds > 1) {
                    clockRef.current?.on('changeRound', (current: number) => {
                        setCurrentRoundDisplay(current)
                    })
                    setCurrentRoundDisplay(1)
                    setTotalRounds(round.numberOfRounds)
                }

                break
            case 'tabata':
                clockRef.current = new TabataTimer(round.work, round.rest, round.numberOfRounds)
                if (round.numberOfRounds > 1) {
                    clockRef.current?.on('changeRound', (current: number) => {
                        setCurrentRoundDisplay(current)
                    })
                    setCurrentRoundDisplay(1)
                    setTotalRounds(round.numberOfRounds)
                }

                clockRef.current?.on('changeActivityStatus', (current: TActivityStatus, status: TTimerStatus) => {
                    setActivityStatus(current)
                })

                break
        }

        clockRef.current?.on('end', () => {
            nextTimer(currRound)
        })
    }

    const handleResetWodTimer = useCallback(() => {
        clockRef.current?.stop()

        setupNewTimer(0)
        setSelectedRound(0)

        setCurrentStatus('initial')
    }, [])

    useEffect(() => {
        setupNewTimer(selectedRound)

        return () => {
            clockRef.current?.stop()
        }
    }, [])

    useEffect(() => {
        if (!isPortrait) navigation.setOptions({ headerShown: false })
        else navigation.setOptions({ headerShown: true })
    }, [isPortrait])

    return (
        <Stack f={1} flexDirection={isPortrait ? 'column' : 'row'}>
            <YStack jc="center" ai="center" p="$7">
                {!isPortrait && (
                    <Stack position="absolute" top={0} left={0}>
                        <Button
                            circular
                            transparent
                            mt="$2"
                            icon={<ChevronLeft size={40} color="$gray2" />}
                            onPress={() => navigation.goBack()}
                        />
                    </Stack>
                )}
                <Stack>
                    <RoundDisplay rounds={rounds} selected={selectedRound} />
                </Stack>
            </YStack>
            <Stack bg="$gray9" f={1} btlr="$6" bblr={!isPortrait ? '$6' : 0} btrr={isPortrait ? '$6' : 0}>
                <TimerDisplay
                    time={dayjs.duration(currentTime, 'seconds').format('mm:ss')}
                    roundNumber={currentRoundDisplay}
                    totalRounds={totalRounds}
                    activityStatus={activityStatus}
                    initialCountdown={currentCountdown ? String(currentCountdown) : null}
                    watchProgressStatus={currentStatus}
                    onPressPlayButton={() => startClock(0)}
                    onPressResetButton={handleResetWodTimer}
                    onPressPauseButton={() => {
                        clockRef.current?.stop()
                    }}
                    round={rounds[selectedRound]}
                />
            </Stack>
        </Stack>
    )
}

export default WodTimerScreen
