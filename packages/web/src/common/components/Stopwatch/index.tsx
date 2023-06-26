import dayjs from 'dayjs'
import { FiPlay, FiSkipBack, FiSquare } from 'solid-icons/fi'

import { Component, createSignal } from 'solid-js'

import { StopwatchTimer } from '@utils/timer'

const Stopwatch: Component = () => {
    const [currentTime, setCurrentTime] = createSignal(0)
    const [currentStatus, setCurrentStatus] = createSignal('initial')
    const clock = new StopwatchTimer()

    clock.on('changeStatus', (status) => {
        setCurrentStatus(status)
    })

    clock.on('tick', (duration: number, start, current) => {
        setCurrentTime(duration)
    })

    clock.on('reset', () => {
        setCurrentTime(0)
    })

    return (
        <div class="flex flex-col items-center p-6">
            <h2 class="text-gray-200 font-bold text-lg">Cronômetro</h2>
            <h3 class="text-gray-300 text-sm">Tempo</h3>
            <div class="text-center text-gray-900 text-[40pt] font-bold">
                {dayjs.duration(currentTime(), 'millisecond').format('mm:ss:SSS')}
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

export default Stopwatch
