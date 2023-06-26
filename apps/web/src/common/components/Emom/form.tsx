import { stringTimeToSeconds } from 'goal-utils'
import { FiPlay } from 'solid-icons/fi'

import { Component, createSignal } from 'solid-js'

export interface RegressiveFormProps {
    handleNext(each: number, rounds: number): void
}
const EmomForm: Component<RegressiveFormProps> = (props) => {
    const [minuteTime, setMinuteTime] = createSignal(0)
    const [secondTime, setSecondTime] = createSignal(0)
    const [rounds, setRounds] = createSignal(1)

    return (
        <div class="flex flex-col items-center p-6">
            <h2 class="text-gray-200 font-bold text-lg">Defina qual o tempo</h2>

            <div class="text-center text-gray-900 text-[40pt] font-bold">
                <input
                    name="minute"
                    class="bg-[transparent] w-16 text-center removeArrows outline-none"
                    max={99}
                    type="number"
                    onInput={(e) => {
                        setMinuteTime(Number((e.target as any).value))
                    }}
                    value={minuteTime()}
                />
                :
                <input
                    name="second"
                    class="bg-[transparent] w-16 text-center removeArrows outline-none"
                    type="number"
                    onInput={(e) => {
                        setSecondTime(Number((e.target as any).value))
                    }}
                    value={secondTime()}
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
                    props.handleNext(stringTimeToSeconds(`${minuteTime()}:${secondTime()}`), rounds())
                }}
            >
                <FiPlay size={40} />
            </button>
        </div>
    )
}

export default EmomForm
