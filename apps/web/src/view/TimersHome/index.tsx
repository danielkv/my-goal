import { Component, Match, Switch } from 'solid-js'

import Emom from '@components/Emom'
import Regressive from '@components/Regressive'
import Stopwatch from '@components/Stopwatch'
import Tabata from '@components/Tabata'

export interface TimersHomeProps {
    timer: 'stopwatch' | 'regressive' | 'emom' | 'tabata'
}

const TimersHome: Component<TimersHomeProps> = (props) => {
    return (
        <main class="p-16">
            <Switch>
                <Match when={props.timer === 'stopwatch'}>
                    <Stopwatch />
                </Match>
                <Match when={props.timer === 'regressive'}>
                    <Regressive />
                </Match>
                <Match when={props.timer === 'emom'}>
                    <Emom />
                </Match>
                <Match when={props.timer === 'tabata'}>
                    <Tabata />
                </Match>
            </Switch>
        </main>
    )
}

export default TimersHome
