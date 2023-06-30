import { useEffect, useState } from 'react'

import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { logMessageUseCase } from '@useCases/log/logMessage'
import { createAppException } from '@utils/exceptions/AppException'

export function useStorage<T = any>(key: string, defaultValue?: T) {
    const [loading, setLoading] = useState(true)
    const [loadingSet, setLoadingSet] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [currentValue, setCurrentValue] = useState<T | null>(defaultValue || null)
    const { getItem, setItem: setItemNative, ...storage } = useAsyncStorage(key)

    async function initalLoad() {
        setError(null)
        setLoading(true)

        try {
            const value = (await getItem()) as T
            if (!value && defaultValue) {
                setCurrentValue(defaultValue)
                return
            }
            setCurrentValue(value)
        } catch (err) {
            const logError = createAppException('ERROR_CAUGHT', err)
            logMessageUseCase(logError.toObject())
            setError(err as Error)
        } finally {
            setLoading(false)
        }
    }

    async function setItem(value: T) {
        setLoadingSet(true)
        try {
            setCurrentValue(value)
            await setItemNative(value as string)
        } catch (err) {
            const logError = createAppException('ERROR_CAUGHT', err)
            logMessageUseCase(logError.toObject())
            setError(err as Error)
        } finally {
            setLoadingSet(false)
        }
    }

    useEffect(() => {
        initalLoad()
    }, [])

    return {
        ...storage,
        setItem,
        error,
        currentValue,
        loading,
        loadingSet,
    }
}
