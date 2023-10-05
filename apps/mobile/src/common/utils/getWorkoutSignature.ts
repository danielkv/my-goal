import * as Crypto from 'expo-crypto'
import { IEventBlock } from 'goal-models'
import { displayArray } from 'goal-utils'
import { isArray, pick } from 'radash'

export async function getWorkoutSignature(workout: IEventBlock): Promise<string> {
    const pickedWorkout = pick(workout, ['config', 'info', 'rounds', 'type'])
    const normalized = _normalize(pickedWorkout)

    const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, JSON.stringify(normalized))

    return digest
}

function _normalize(data: any): string {
    const finalString: string[] = []

    if (['number', 'bigint', 'boolean', 'string'].includes(typeof data)) finalString.push(String(data))

    if (isArray(data)) {
        finalString.push(displayArray(data.map(_normalize), '/'))
    }

    if (typeof data === 'object') {
        const keys = Object.keys(data)
        keys.sort()
        finalString.push(
            displayArray(
                keys.map((k) => _normalize(data[k])),
                '/'
            )
        )
    }

    return displayArray(finalString, '/').replace(/\s+/g, '').toLocaleLowerCase()
}
