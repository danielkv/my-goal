import { IBlockV1, IEventBlock, IRestBlock, ITextBlock, TBlockType } from 'goal-models'

import { Component, For, Match, Switch, createEffect, createSignal } from 'solid-js'

import TextInput from '@components/TextInput'

import EventBlockForm from './EventBlockForm'
import RestBlockForm from './RestBlockForm'
import TextBlockForm from './TextBlockForm'
import { TBlockForm, blockTypes } from './config'

export interface BlockFormProps {
    onClickNext(data: TBlockForm): void
    block: IBlockV1
}

const BlockForm: Component<BlockFormProps> = (props) => {
    const [type, setType] = createSignal<TBlockType>(props.block.type || '')
    const [info, setInfo] = createSignal<string>(props.block.info || '')

    createEffect(() => {
        setType(props.block.type)
        setInfo(props.block.info || '')
    })

    const handleSubmit = (values: TBlockForm) => {
        props.onClickNext(values)
    }

    return (
        <>
            <div class="flex flex-col">
                <label class="text-sm mb-2">Tipo de bloco</label>
                <select class="input input-full" onChange={(e) => setType((e.target as any).value)}>
                    <For each={blockTypes}>
                        {(item) => (
                            <option value={item.key} selected={type() === item.key}>
                                {item.label}
                            </option>
                        )}
                    </For>
                </select>
            </div>

            <TextInput
                onChange={(e) => setInfo((e.target as any).value)}
                class="flex-1"
                label="Bloco de informação"
                name="info"
                value={info()}
            />

            <Switch>
                <Match when={type() === 'event'}>
                    <EventBlockForm
                        block={props.block as IEventBlock}
                        onClickNext={(eventBlock) => {
                            handleSubmit({
                                type: 'event',
                                config: eventBlock.config,
                                rounds: eventBlock.rounds,
                                info: info(),
                                name: eventBlock.name,
                            })
                        }}
                    />
                </Match>
                <Match when={type() === 'rest'}>
                    <RestBlockForm
                        block={props.block as IRestBlock}
                        onClickNext={(restBlock) => {
                            handleSubmit({ ...restBlock, type: 'rest', info: info() || undefined })
                        }}
                    />
                </Match>
                <Match when={type() === 'text'}>
                    <TextBlockForm
                        block={props.block as ITextBlock}
                        onClickNext={(textBlock) => {
                            handleSubmit({ ...textBlock, type: 'text', info: info() || undefined })
                        }}
                    />
                </Match>
            </Switch>
        </>
    )
}

export default BlockForm
