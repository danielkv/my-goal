import { stringTimeToSeconds } from 'goal-utils'
import { FiPlay } from 'solid-icons/fi'

import { Component, createSignal } from 'solid-js'

export interface RegressiveFormProps {
    handleNext(work: number, rest: number, rounds: number): void
}
const TabataForm: Component<RegressiveFormProps> = (props) => {
    const [minuteTimeWork, setMinuteTimeWork] = createSignal(0)
    const [secondTimeWork, setSecondTimeWork] = createSignal(20)
    const [minuteTimeRest, setMinuteTimeRest] = createSignal(0)
    const [secondTimeRest, setSecondTimeRest] = createSignal(10)
    const [rounds, setRounds] = createSignal(8)

    return (
        <div class="flex flex-col items-center p-6">
            <h2 class="text-gray-300 font-bold text-lg">Defina qual o tempo de exercício</h2>

            <div class="text-center text-gray-900 text-[40pt] font-bold">
                <input
                    name="minute"
                    class="bg-[transparent] w-16 text-center removeArrows outline-none"
                    max={99}
                    type="number"
                    onInput={(e) => {
                        setMinuteTimeWork(Number((e.target as any).value))
                    }}
                    value={minuteTimeWork()}
                />
                :
                <input
                    name="second"
                    class="bg-[transparent] w-16 text-center removeArrows outline-none"
                    type="number"
                    onInput={(e) => {
                        setSecondTimeWork(Number((e.target as any).value))
                    }}
                    value={secondTimeWork()}
                />
            </div>

            <h2 class="text-gray-300 font-bold text-lg">Defina qual o tempo de descanso</h2>

            <div class="text-center text-gray-900 text-[40pt] font-bold">
                <input
                    name="minuteRest"
                    class="bg-[transparent] w-16 text-center removeArrows outline-none"
                    max={99}
                    type="number"
                    onInput={(e) => {
                        setMinuteTimeRest(Number((e.target as any).value))
                    }}
                    value={minuteTimeRest()}
                />
                :
                <input
                    name="secondRest"
                    class="bg-[transparent] w-16 text-center removeArrows outline-none"
                    type="number"
                    onInput={(e) => {
                        setSecondTimeRest(Number((e.target as any).value))
                    }}
                    value={secondTimeRest()}
                />
            </div>
            <h2 class="text-gray-300 font-bold text-lg">Quantos rounds</h2>
            <input
                name="rounds"
                class="bg-[transparent] w-16 text-center removeArrows outline-none text-gray-900 text-[40pt] font-bold"
                type="number"
                onInput={(e) => {
                    setRounds(Number((e.target as any).value))
                }}
                value={rounds()}
            />
            <button
                class="bg-gray-900 p-3 rounded-full hover:bg-gray-700"
                onClick={() => {
                    const work = stringTimeToSeconds(`${minuteTimeWork()}:${secondTimeWork()}`)
                    const rest = stringTimeToSeconds(`${minuteTimeRest()}:${secondTimeRest()}`)
                    props.handleNext(work, rest, rounds())
                }}
            >
                <FiPlay size={40} />
            </button>
        </div>
    )
}

export default TabataForm
