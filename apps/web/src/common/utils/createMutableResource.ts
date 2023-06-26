import { createEffect } from 'solid-js'
import { createStore } from 'solid-js/store'

interface Unresolved {
    state: 'unresolved'
    loading: false
    resource?: undefined
}
interface Pending {
    state: 'pending'
    loading: true
    resource?: undefined
}
interface Ready<T> {
    state: 'ready'
    loading: false
    latest: T | undefined
    resource: T
}
interface Refreshing<T> {
    state: 'refreshing'
    loading: true
    latest: T | undefined
    resource: T
}
interface Errored {
    state: 'errored'
    loading: false
    error: any
    resource: undefined
}

type StoreResource<T> = Unresolved | Pending | Ready<T> | Refreshing<T> | Errored

type TStoreResourceActions<R> = {
    refetch(): Promise<void>
    mutate(mutation: (data: R | undefined) => R | undefined): void
}

type StoreResourceReturn<T> = [StoreResource<T>, TStoreResourceActions<T>]

function hasResource<T>(data: StoreResource<T>): data is Ready<T> | Refreshing<T> {
    return ['ready', 'refreshing'].includes(data.state)
}

export function createStoreResource<S, R extends Record<string, any>>(
    source: S,
    fetcher: (source?: S) => Promise<R> | R
): StoreResourceReturn<R> {
    const [store, setStore] = createStore<StoreResource<R>>({
        state: 'pending',
        loading: true,
    })

    createEffect(() => {
        Promise.resolve(fetcher(source))
            .then((resource) => {
                setStore((data) => ({
                    state: 'ready',
                    loading: false,
                    latest: hasResource(data) ? data.resource : undefined,
                    resource,
                }))
            })
            .catch((err) => {
                setStore((data) => ({
                    state: 'errored',
                    loading: false,
                    latest: hasResource(data) ? data.resource : undefined,
                    error: err,
                }))
            })
    })

    function mutate(mutation: (data: R | undefined) => R | undefined): void {
        const result = mutation(hasResource(store) ? store.resource : undefined)

        setStore((data) => ({
            state: 'ready',
            loading: false,
            resource: result,
            latest: hasResource(data) ? data.resource : undefined,
        }))
    }

    function refetch(): Promise<void> {
        setStore((data) => ({
            state: 'refreshing',
            loading: true,
            latest: hasResource(data) ? data.resource : undefined,
        }))

        return Promise.resolve(fetcher(source))
            .then((resource) => {
                setStore((data) => ({
                    state: 'ready',
                    loading: false,
                    latest: hasResource(data) ? data.resource : undefined,
                    resource,
                }))
            })
            .catch((err) => {
                setStore((data) => ({
                    state: 'errored',
                    loading: false,
                    error: err,
                }))
            })
    }

    const resourceResult: StoreResourceReturn<R> = [store, { refetch, mutate }]

    return resourceResult
}
