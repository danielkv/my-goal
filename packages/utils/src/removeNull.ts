import { isArray, isObject } from 'radash'

export function removeNull<T extends unknown>(value: T): T {
    if (isArray(value)) {
        return value.map(removeNull).filter((v) => v) as T
    } else if (isObject(value)) {
        const entries = Object.entries(value)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, value === Object(value) ? removeNull(value) : value])

        return Object.fromEntries(entries)
    }

    return value
}
