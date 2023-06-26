import { useEffect, useRef } from 'react'

import RegressiveSvg from '@assets/svg/regressive.svg'
import TimerDisplay from '@components/TimerDisplay'
import { useTimer } from '@contexts/timers/useTimer'
import { IEventBlock, IRound } from '@models/block'
import { RegressiveTimer } from '@utils/timer'

import dayjs from 'dayjs'

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
        clockRef.current = new RegressiveTimer(initialTime)
        return () => {
            clockRef.current?.stop()
        }
    }, [])

    const { currentStatus, currentTime, handlePressPlayButton, handlePressResetButton, initialCountdown } = useTimer({
        clockRef,
        initialCountdown: _initialCountdown,
        onSetupTimer: (clockRef, sounds) => {
            clockRef.current?.on('zero', () => {
                sounds.playFinish()
            })
        },
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
