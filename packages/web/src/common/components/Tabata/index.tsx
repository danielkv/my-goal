import { Component, batch, createSignal } from 'solid-js'

import TabataClock from './clock'
import TabataForm from './form'

const Tabata: Component = () => {
    const [work, setWork] = createSignal(0)
    const [rest, setRest] = createSignal(0)
    const [rounds, setRounds] = createSignal(1)

    return (
        <>
            {work() === 0 ? (
                <TabataForm
                    handleNext={(work, rest, rounds) => {
                        batch(() => {
                            setWork(work)
                            setRest(rest)
                            setRounds(rounds)
                        })
                    }}
                />
            ) : (
                <TabataClock work={work()} rest={rest()} rounds={rounds()} />
            )}
        </>
    )
}

export default Tabata
