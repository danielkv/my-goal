import { useEffect, useRef } from 'react'

import dayjs from 'dayjs'
import { IEventBlock, IRound } from 'goal-models'
import { StopwatchTimer } from 'goal-utils'

import StopwatchSvg from '@assets/svg/stopwatch.svg'
import TimerDisplay from '@components/TimerDisplay'
import { useTimer } from '@contexts/timers/useTimer'

export interface StopwatchDisplayProps {
    finalTime: number
    initialCountdown: number
    onPressReset(): void
    round?: IRound
    block?: IEventBlock
}

const StopwatchDisplay: React.FC<StopwatchDisplayProps> = ({
    finalTime,
    initialCountdown: _initialCountdown,
    onPressReset,
    round,
    block,
}) => {
    const clockRef = useRef<StopwatchTimer>()

    useEffect(() => {
        clockRef.current = new StopwatchTimer({ endTime: finalTime, endingCountdown: _initialCountdown })

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
            time={dayjs.duration(currentTime, 'seconds').format('mm:ss')}
            Icon={StopwatchSvg}
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

export default StopwatchDisplay
