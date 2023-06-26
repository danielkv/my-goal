import { RefObject, useEffect, useRef, useState } from 'react'

import { TTimerStatus } from '@common/interfaces/timers'
import { UseTimerSounds, useTimerSounds } from '@contexts/timers/useTimerSounds'
import { RegressiveTimer, StopwatchTimer } from '@utils/timer'

interface Args {
    initialCurrentTime?: number
    initialCountdown?: number
    clockRef: RefObject<StopwatchTimer | undefined>
    onSetupTimer?: (
        clockRef: RefObject<StopwatchTimer | undefined>,
        sounds: UseTimerSounds,
        setCurrentTime: React.Dispatch<React.SetStateAction<number>>
    ) => void
}

export function useTimer({ initialCountdown: _initialCountdown, clockRef, onSetupTimer, initialCurrentTime }: Args) {
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

            countdownTimer.once('zero', () => {
                setCurrentCountdown(null)
                clockRef.current?.start()
            })
            return
        }

        clockRef.current?.start()
    }

    const handlePressResetButton = (opts?: Pick<Args, 'initialCountdown' | 'initialCurrentTime'>) => {
        countdownRef.current = opts?.initialCountdown ?? _initialCountdown ?? null

        setCurrentTime(opts?.initialCurrentTime || 0)
        setCurrentStatus('initial')
        clockRef.current?.reset()
    }

    const setupTimer = () => {
        clockRef.current?.on('changeStatus', (status) => {
            setCurrentStatus(status)
        })

        clockRef.current?.on('tick', (duration: number, _, __, remaining: number) => {
            if (remaining > 0 && remaining <= 3) sounds.playBeep()

            setCurrentTime(duration)
        })

        clockRef.current?.once('start', () => {
            sounds.playStart()
        })

        clockRef.current?.on('start', (elapsed: number, start: number) => {
            setCurrentTime(start)
        })

        clockRef.current?.on('reset', () => {
            setCurrentTime(0)
            setCurrentStatus('initial')
            setCurrentCountdown(_initialCountdown || null)
        })

        onSetupTimer?.(clockRef, sounds, setCurrentTime)

        return clockRef.current
    }

    const setupCountdown = (countdown: number) => {
        setCurrentCountdown(() => countdown)

        initialCountdownRef.current = new RegressiveTimer(countdown)

        initialCountdownRef.current.once('start', () => {
            sounds.playBeep()
        })

        initialCountdownRef.current.on('tick', (displayTime: number) => {
            setCurrentCountdown((prev) => {
                if (displayTime > 0 && displayTime != prev) sounds.playBeep()

                return displayTime
            })
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
