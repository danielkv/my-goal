import dayjs from 'dayjs'
import { FiPlay, FiSkipBack, FiSquare } from 'solid-icons/fi'

import { Component, createSignal } from 'solid-js'

import { TabataTimer } from '@utils/timer'

export interface RegressiveProps {
    work: number // seconds
    rest: number // seconds
    rounds: number
}

const TabataClock: Component<RegressiveProps> = (props) => {
    const [currentTime, setCurrentTime] = createSignal(props.work)
    const [currentStatus, setCurrentStatus] = createSignal('initial')
    const [currentRound, setCurrentRound] = createSignal(1)

    const clock = new TabataTimer(props.work, props.rest, props.rounds)

    clock.on('changeStatus', (status) => {
        setCurrentStatus(status)
    })

    clock.on('changeRound', (status) => {
        setCurrentRound(status)
    })

    clock.on('tick', (duration: number, start, current) => {
        setCurrentTime(duration)
    })

    clock.on('reset', () => {
        setCurrentTime(props.work)
    })

    return (
        <div class="flex flex-col items-center p-6">
            <h2 class="text-gray-200 font-bold text-lg">Cronometro Tabata</h2>
            <h3 class="text-gray-300 text-sm">Tempo</h3>
            <div class="text-center text-gray-900 text-[40pt] font-bold">
                {dayjs.duration(currentTime(), 'second').format('mm:ss')}
            </div>
            <h3 class="text-gray-300 text-sm">Round</h3>
            <div class="text-center text-gray-900 text-[40pt] font-bold">{currentRound()}</div>

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

export default TabataClock
