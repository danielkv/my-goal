import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import dayjs from 'dayjs'
import { IEventBlock, IRound, TActivityStatus, TTimerStatus } from 'goal-models'
import { DEFAULT_INTERVAL, Timer, isRestRound } from 'goal-utils'
import { EmomTimer, RegressiveTimer, StopwatchTimer, TabataTimer } from 'goal-utils'
import { Stack, YStack } from 'tamagui'

import { useOrientation } from '@common/hooks/useOrientation'
import Button from '@components/Button'
import TimerDisplay from '@components/TimerDisplay'
import { useTimerSounds } from '@contexts/timers/useTimerSounds'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'
import { ChevronLeft } from '@tamagui/lucide-icons'

import RoundDisplay from './RoundDisplay'

function flattenRounds(block: IEventBlock): IRound[] {
    const flattened = Array.from({ length: block.config.numberOfRounds || 1 }).flatMap(() =>
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
    const [activityStatus, setActivityStatus] = useState<TActivityStatus | 'countdown' | null>(null)
    const [currentStatus, setCurrentStatus] = useState<TTimerStatus>('initial')
    const [currentCountdown, setCurrentCountdown] = useState<number | null>(null)
    const [currentTime, setCurrentTime] = useState<number>(0)

    const rounds = useMemo(() => flattenRounds(block), [])

    const [selectedRound, setSelectedRound] = useState(0)

    const clockRef = useRef<Timer>()
    const countdownTimerRef = useRef<RegressiveTimer>()

    function startClock(round?: number) {
        if (currentStatus === 'initial') setupTimer()

        if (round === 0 && currentStatus === 'initial') {
            setCurrentStatus('running')
            setActivityStatus('countdown')

            const countdownTimer = setupCountdown(COUNTDOWN)
            countdownTimer.start()

            countdownTimer.on('finish', () => {
                countdownTimer.stop()
                setCurrentCountdown(null)
                clockRef.current?.start()
                setActivityStatus('work')
            })
            return
        }

        clockRef.current?.start()
    }

    function setupTimer() {
        clockRef.current?.on('changeStatus', (status) => {
            setCurrentStatus(status)
        })

        clockRef.current?.on('finalCountdownTick', (currentTime) => {
            sounds.playBeep()
        })

        clockRef.current?.on('timeElapsed', (currentTime) => {
            setCurrentTime(currentTime)
        })

        clockRef.current?.on('reset', () => {
            setCurrentStatus('initial')
        })

        return clockRef.current
    }

    function setupCountdown(countdown: number) {
        setCurrentCountdown(() => countdown)

        countdownTimerRef.current = new RegressiveTimer({ startTime: countdown, endingCountdown: 3 })

        countdownTimerRef.current.on('finalCountdownTick', () => {
            sounds.playBeep()
        })

        countdownTimerRef.current.on('timeElapsed', (currentTime) => {
            setCurrentCountdown(currentTime)
        })

        return countdownTimerRef.current
    }

    function endAllRounds() {
        setCurrentTime(0)
        sounds.playFinish()
    }

    function nextTimer(currRound: number) {
        clockRef.current?.stop()
        clockRef.current?.removeAllListeners()

        const nextRound = currRound + 1

        setupNewTimer(nextRound)

        startClock(nextRound)

        setSelectedRound(nextRound)
    }

    function setupNewTimer(currRound: number) {
        const round = rounds[currRound]

        setCurrentRoundDisplay(null)

        if (isRestRound(round)) {
            clockRef.current = new RegressiveTimer({ startTime: round.time, endingCountdown: COUNTDOWN })

            setActivityStatus('rest')
        } else {
            switch (round.config.type) {
                case 'amrap':
                    clockRef.current = new RegressiveTimer({
                        startTime: round.config.timecap,
                        endingCountdown: COUNTDOWN,
                    })

                    break
                case 'for_time':
                    clockRef.current = new StopwatchTimer({ endTime: round.config.timecap, endingCountdown: COUNTDOWN })
                    break

                case 'emom':
                    clockRef.current = new EmomTimer({
                        each: round.config.each,
                        rounds: round.config.numberOfRounds || 1,
                        endingCountdown: COUNTDOWN,
                    })
                    if ((round.config.numberOfRounds || 1) > 1) {
                        ;(clockRef.current as EmomTimer).on('changeRound', (current: number) => {
                            setCurrentRoundDisplay(current)
                        })
                        ;(clockRef.current as EmomTimer).on('finishRound', () => {
                            sounds.playStart()
                        })
                        setCurrentRoundDisplay(1)
                        setTotalRounds(round.config.numberOfRounds || 1)
                    }

                    break
                case 'tabata':
                    clockRef.current = new TabataTimer({
                        work: round.config.work,
                        rest: round.config.rest,
                        rounds: round.config.numberOfRounds || 1,
                    })
                    if ((round.config.numberOfRounds || 1) > 1) {
                        ;(clockRef.current as TabataTimer).on('changeRound', (current: number) => {
                            setCurrentRoundDisplay(current)
                        })
                        ;(clockRef.current as TabataTimer).on('finishRound', () => {
                            sounds.playStart()
                        })
                        setCurrentRoundDisplay(1)
                        setTotalRounds(round.config.numberOfRounds || 1)
                    }

                    ;(clockRef.current as TabataTimer).on('changeActivityStatus', (current) => {
                        setActivityStatus(current)
                    })
                    ;(clockRef.current as TabataTimer).on('finishActivity', () => {
                        sounds.playStart()
                    })

                    break
            }
            setActivityStatus('work')
        }

        clockRef.current?.on('start', (duration: number) => {
            setCurrentTime(duration)
        })

        clockRef.current?.once('start', () => {
            if (currRound === 0) sounds.playStart()
        })

        clockRef.current?.on('finish', () => {
            if (currRound + 1 >= rounds.length) {
                endAllRounds()
                return
            } else {
                sounds.playStart()

                setTimeout(() => {
                    nextTimer(currRound)
                }, DEFAULT_INTERVAL)
            }
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
            countdownTimerRef.current?.stop()
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
