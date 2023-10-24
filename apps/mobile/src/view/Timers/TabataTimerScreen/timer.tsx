import { useEffect, useRef, useState } from 'react'

import dayjs from 'dayjs'
import { IEventBlock, IRound, TActivityStatus } from 'goal-models'
import { TabataTimer } from 'goal-utils'

import TabataSvg from '@assets/svg/tabata.svg'
import TimerDisplay from '@components/TimerDisplay'
import { useTimer } from '@contexts/timers/useTimer'

export interface TabataDisplayProps {
    work: number
    rest: number
    rounds: number
    initialCountdown: number
    onPressReset(): void
    round?: IRound
    block?: IEventBlock
}

const TabataDisplay: React.FC<TabataDisplayProps> = ({
    work,
    rest,
    rounds,
    initialCountdown: _initialCountdown,
    onPressReset,
    block,
    round,
}) => {
    const [currentRound, setCurrentRound] = useState(1)
    const [currentActivityStatus, setCurrentActivityStatus] = useState<TActivityStatus>('work')

    const clockRef = useRef<TabataTimer>()

    useEffect(() => {
        clockRef.current = new TabataTimer({ work, rest, rounds, endingCountdown: _initialCountdown })

        return () => {
            clockRef.current?.stop()
        }
    }, [])

    const { currentStatus, currentTime, handlePressPlayButton, handlePressResetButton, initialCountdown } = useTimer({
        clockRef,
        initialCountdown: _initialCountdown,
        initialCurrentTime: work,
        onSetupTimer: (clockRef, sounds) => {
            clockRef.current?.on('changeActivityStatus', (current) => {
                setCurrentActivityStatus(current)
            })
            clockRef.current?.on('finishActivity', () => {
                sounds.playStart()
            })
            clockRef.current?.on('changeRound', (current: number) => {
                setCurrentRound(current)
            })
            clockRef.current?.on('finishRound', () => {
                sounds.playStart()
            })
        },
    })

    return (
        <TimerDisplay
            time={dayjs.duration(currentTime, 'seconds').format('mm:ss')}
            Icon={TabataSvg}
            activityStatus={initialCountdown ? 'countdown' : currentActivityStatus}
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

export default TabataDisplay
