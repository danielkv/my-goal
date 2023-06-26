import { Component, batch, createSignal } from 'solid-js'

import EmomClock from './clock'
import EmomForm from './form'

const Emom: Component = () => {
    const [each, setEach] = createSignal(0)
    const [rounds, setRounds] = createSignal(1)

    return (
        <>
            {each() === 0 ? (
                <EmomForm
                    handleNext={(each, rounds) => {
                        batch(() => {
                            setEach(each)
                            setRounds(rounds)
                        })
                    }}
                />
            ) : (
                <EmomClock each={each()} rounds={rounds()} />
            )}
        </>
    )
}

export default Emom
