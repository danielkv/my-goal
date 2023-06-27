import { useEffect, useRef, useState } from 'react'

import dayjs from 'dayjs'
import { IEventBlock, IRound } from 'goal-models'

import EmomSvg from '@assets/svg/emom.svg'
import TimerDisplay from '@components/TimerDisplay'
import { useTimer } from '@contexts/timers/useTimer'
import { EmomTimer } from '@utils/timer'

export interface EmomDisplayProps {
    each: number
    rounds: number
    initialCountdown: number
    onPressReset(): void
    round?: IRound
    block?: IEventBlock
}

const EmomDisplay: React.FC<EmomDisplayProps> = ({
    each,
    rounds,
    block,
    round,
    initialCountdown: _initialCountdown,
    onPressReset,
}) => {
    const [currentRound, setCurrentRound] = useState(1)

    const clockRef = useRef<EmomTimer>()

    useEffect(() => {
        clockRef.current = new EmomTimer(each, rounds)

        return () => {
            clockRef.current?.stop()
        }
    }, [])

    const { currentStatus, currentTime, handlePressPlayButton, handlePressResetButton, initialCountdown } = useTimer({
        clockRef,
        initialCountdown: _initialCountdown,
        initialCurrentTime: each,
        onSetupTimer: (clockRef, sounds) => {
            clockRef.current?.on('changeRound', (current: number) => {
                setCurrentRound(current)
            })
            clockRef.current?.on('zero', (current: number, rounds: number) => {
                if (current < rounds) sounds.playStart()
                else sounds.playFinish()
            })
        },
    })

    return (
        <TimerDisplay
            time={dayjs.duration(currentTime, 'seconds').format('mm:ss')}
            Icon={EmomSvg}
            roundNumber={currentRound}
            onPressEditButton={onPressReset}
            initialCountdown={initialCountdown ? dayjs.duration(initialCountdown, 'seconds').format('s') : undefined}
            watchProgressStatus={currentStatus}
            onPressPlayButton={handlePressPlayButton}
            onPressResetButton={handlePressResetButton}
            onPressPauseButton={() => {
                clockRef.current?.stop()
            }}
            block={block}
            round={round}
        />
    )
}

export default EmomDisplay
