import dayjs from 'dayjs'
import { RegressiveTimer } from 'goal-utils'
import { FiPlay, FiSkipBack, FiSquare } from 'solid-icons/fi'

import { Component, createSignal } from 'solid-js'

export interface RegressiveProps {
    initialTime: number // seconds
}

const RegressiveClock: Component<RegressiveProps> = (props) => {
    const [currentTime, setCurrentTime] = createSignal(props.initialTime)
    const [currentStatus, setCurrentStatus] = createSignal('initial')

    const clock = new RegressiveTimer({ startTime: props.initialTime, endingCountdown: 3 })

    clock.on('changeStatus', (status) => {
        setCurrentStatus(status)
    })

    clock.on('timeElapsed', (currentTime) => {
        setCurrentTime(currentTime)
    })

    clock.on('reset', () => {
        setCurrentTime(props.initialTime)
    })

    clock.on('finalCountdownTick', (n) => {
        console.log(n)
    })

    return (
        <div class="flex flex-col items-center p-6">
            <h2 class="text-gray-200 font-bold text-lg">Cronômetro Regressivo</h2>
            <h3 class="text-gray-300 text-sm">Tempo({currentStatus()})</h3>
            <div class="text-center text-gray-900 text-[40pt] font-bold">
                {dayjs.duration(currentTime(), 'second').format('mm:ss')}
            </div>

            <div>
                <button
                    class="bg-gray-900 p-3 rounded-full hover:bg-gray-700"
                    onClick={() => {
                        if (currentStatus() !== 'running') clock.start()
                        else clock.stop()
                    }}
                >
                    {currentStatus() === 'running' ? <FiSquare size={40} /> : <FiPlay size={40} />}
                </button>
                <button class="bg-gray-900 p-3 rounded-full hover:bg-gray-700" onClick={() => clock.reset()}>
                    <FiSkipBack size={40} />
                </button>
            </div>
        </div>
    )
}

export default RegressiveClock
