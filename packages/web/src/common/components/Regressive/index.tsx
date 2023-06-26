import { Component, createSignal } from 'solid-js'

import RegressiveClock from './clock'
import RegressiveForm from './form'

const Regressive: Component = () => {
    const [time, setTime] = createSignal(0)

    return (
        <>
            {time() === 0 ? (
                <RegressiveForm handleNext={(time) => setTime(time)} />
            ) : (
                <RegressiveClock initialTime={time()} />
            )}
        </>
    )
}

export default Regressive
