import { useEffect, useRef } from 'react'

import dayjs from 'dayjs'
import { IEventBlock, IRound } from 'goal-models'
import { RegressiveTimer } from 'goal-utils'

import RegressiveSvg from '@assets/svg/regressive.svg'
import TimerDisplay from '@components/TimerDisplay'
import { useTimer } from '@contexts/timers/useTimer'

export interface RegressiveDisplayProps {
    initialTime: number
    initialCountdown: number
    onPressReset(): void
    round?: IRound
    block?: IEventBlock
}

const RegressiveDisplay: React.FC<RegressiveDisplayProps> = ({
    initialTime,
    initialCountdown: _initialCountdown,
    onPressReset,
    block,
    round,
}) => {
    const clockRef = useRef<RegressiveTimer>()

    useEffect(() => {
        clockRef.current = new RegressiveTimer({ startTime: initialTime, endingCountdown: _initialCountdown })
        return () => {
            clockRef.current?.stop()
        }
    }, [])

    const { currentStatus, currentTime, handlePressPlayButton, handlePressResetButton, initialCountdown } = useTimer({
        clockRef,
        initialCountdown: _initialCountdown,
    })

    return (
        <TimerDisplay
            time={dayjs.duration(currentTime, 'second').format('mm:ss')}
            Icon={RegressiveSvg}
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

export default RegressiveDisplay
