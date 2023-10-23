import { RefObject, useEffect, useRef, useState } from 'react'

import { TTimerStatus } from 'goal-models'
import { RegressiveTimer, Timer } from 'goal-utils'

import { UseTimerSounds, useTimerSounds } from '@contexts/timers/useTimerSounds'

interface Args<Clock extends Timer> {
    initialCurrentTime?: number
    initialCountdown?: number
    clockRef: RefObject<Clock | undefined>
    onSetupTimer?: (
        clockRef: RefObject<Clock | undefined>,
        sounds: UseTimerSounds,
        setCurrentTime: React.Dispatch<React.SetStateAction<number>>
    ) => void
}

export function useTimer<Clock extends Timer>({
    initialCountdown: _initialCountdown,
    clockRef,
    onSetupTimer,
    initialCurrentTime,
}: Args<Clock>) {
    const [currentTime, setCurrentTime] = useState(initialCurrentTime || 0)
    const [currentStatus, setCurrentStatus] = useState<TTimerStatus>('initial')
    const [currentCountdown, setCurrentCountdown] = useState<number | null>(_initialCountdown || null)

    const countdownRef = useRef(_initialCountdown ?? null)

    const initialCountdownRef = useRef<RegressiveTimer>()
    const sounds = useTimerSounds()

    useEffect(() => {
        return () => {
            initialCountdownRef.current?.stop()
        }
    }, [])

    const handlePressPlayButton = () => {
        if (currentStatus === 'initial') setupTimer()

        if (countdownRef.current && currentStatus === 'initial') {
            setCurrentStatus('running')

            const countdownTimer = setupCountdown(countdownRef.current)
            countdownTimer.start()

            countdownTimer.once('finish', () => {
                setCurrentCountdown(null)
                clockRef.current?.start()
            })
            return
        }

        clockRef.current?.start()
    }

    const handlePressResetButton = (opts?: Pick<Args<Clock>, 'initialCountdown' | 'initialCurrentTime'>) => {
        countdownRef.current = opts?.initialCountdown ?? _initialCountdown ?? null

        setCurrentTime(opts?.initialCurrentTime || 0)
        setCurrentStatus('initial')
        clockRef.current?.reset()
    }

    const setupTimer = () => {
        clockRef.current?.on('changeStatus', (status) => {
            setCurrentStatus(status)
        })

        clockRef.current?.on('finalCountdownTick', () => {
            sounds.playBeep()
        })

        clockRef.current?.on('timeElapsed', (currentTime) => {
            setCurrentTime(currentTime)
        })

        clockRef.current?.once('start', () => {
            sounds.playStart()
        })

        clockRef.current?.on('start', () => {
            setCurrentTime(initialCurrentTime || 0)
        })

        clockRef.current?.on('reset', () => {
            setCurrentTime(0)
            setCurrentStatus('initial')
            setCurrentCountdown(_initialCountdown || null)
        })

        clockRef.current?.on('finish', () => {
            sounds.playFinish()
        })

        onSetupTimer?.(clockRef, sounds, setCurrentTime)

        return clockRef.current
    }

    const setupCountdown = (countdown: number) => {
        setCurrentCountdown(() => countdown)

        initialCountdownRef.current = new RegressiveTimer({ startTime: countdown, endingCountdown: 3 })

        initialCountdownRef.current.on('finalCountdownTick', () => {
            sounds.playBeep()
        })

        initialCountdownRef.current.on('timeElapsed', (currentTime) => {
            setCurrentCountdown(currentTime)
        })

        return initialCountdownRef.current
    }

    return {
        currentTime,
        currentStatus,
        initialCountdown: currentCountdown,

        sounds,

        handlePressPlayButton,
        handlePressResetButton,
    }
}
