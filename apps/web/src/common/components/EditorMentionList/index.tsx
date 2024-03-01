import { IMovement } from 'goal-models'
import { debounce } from 'radash'

import { Component, For, Show, createEffect, createSignal, onMount } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import { Stack } from '@suid/material'
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import { getMovementsUseCase } from '@useCases/movements/getMovements'

export interface EditorMenuListRef {
    onKeyDown: (props: SuggestionKeyDownProps) => boolean
}

export interface EditorMenuListProps extends SuggestionProps {
    updateHandler?: (handlers: EditorMenuListRef) => void
}

export const EditorMenuList: Component<EditorMenuListProps> = (props) => {
    const [selectedIndex, setSelectedIndex] = createSignal(0)
    const [items, setItems] = createSignal<IMovement[]>([])
    const [loading, setLoading] = createSignal(true)

    const debouncedSearch = debounce({ delay: 400 }, (query: string) => {
        setLoading(true)
        getMovementsUseCase({ search: query, pageSize: 5 })
            .then((results) => {
                setItems(results.items)
                setSelectedIndex(0)
            })
            .finally(() => setLoading(false))
    })

    createEffect(() => {
        debouncedSearch(props.query)
    })

    const selectItem = (index: number) => {
        const item = items()[index]

        if (item) {
            props.command({ id: item.id, label: item.movement })
        }
    }

    const upHandler = () => {
        setSelectedIndex((selectedIndex() + items().length - 1) % items().length)
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex() + 1) % items().length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex())
    }

    onMount(() => setSelectedIndex(0))

    onMount(() => {
        props.updateHandler?.({
            onKeyDown: ({ event }) => {
                if (event.key === 'ArrowUp') {
                    upHandler()
                    return true
                }

                if (event.key === 'ArrowDown') {
                    downHandler()
                    return true
                }

                if (event.key === 'Enter') {
                    enterHandler()
                    return true
                }

                return false
            },
        })
    })

    return (
        <Stack class="bg-gray-900 rounded-md text-white p-1 min-w-28">
            <Show when={loading()}>
                <Stack class="m-2 flex-1 items-center">
                    <ActivityIndicator color="white" />
                </Stack>
            </Show>
            <Show when={!items().length && !loading()}>
                <div class="px-3 py-4 text-gray-400">Nenhum resultado</div>
            </Show>
            <Show when={!loading()}>
                <For each={items()}>
                    {(item, index) => (
                        <button
                            class={`text-left hover:bg-gray-800 py-1 px-2 rounded-sm text-sm ${
                                index() === selectedIndex() ? '!bg-gray-600' : ''
                            }`}
                            onClick={() => selectItem(index())}
                        >
                            {item.movement}
                        </button>
                    )}
                </For>
            </Show>
        </Stack>
    )
}
