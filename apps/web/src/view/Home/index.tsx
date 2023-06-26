import { Component, For } from 'solid-js'

import EmomIcon from '@assets/svg/emom.svg?component-solid'
import RegressiveIcon from '@assets/svg/regressive.svg?component-solid'
import StopwatchIcon from '@assets/svg/stopwatch.svg?component-solid'
import TabataIcon from '@assets/svg/tabata.svg?component-solid'
import { A } from '@solidjs/router'

const timers = [
    { href: '/timer/stopwatch', label: 'Stopwatch', Icon: StopwatchIcon },
    { href: '/timer/regressive', label: 'Regressive', Icon: RegressiveIcon },
    { href: '/timer/emom', label: 'EMOM', Icon: EmomIcon },
    { href: '/timer/tabata', label: 'Tabata', Icon: TabataIcon },
]

const Home: Component<{}> = () => {
    return (
        <>
            <main class="flex items-center flex-col p-12">
                <h1 class="mb-16 text-4xl">Selecione o Timer</h1>
                <div class="grid grid-cols-2 w-[260px] gap-2">
                    <For each={timers}>
                        {(timer) => (
                            <A
                                href={timer.href}
                                class="bg-gray-800 rounded flex flex-col h-36 justify-center items-center hover:bg-gray-700"
                            >
                                <div class="mb-2">
                                    <timer.Icon height={40} />
                                </div>
                                <h3>{timer.label}</h3>
                            </A>
                        )}
                    </For>
                </div>
            </main>
        </>
    )
}

export default Home
