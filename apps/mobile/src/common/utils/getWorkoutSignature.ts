import * as Crypto from 'expo-crypto'
import { IEventBlock } from 'goal-models'
import { pick } from 'radash'

export async function getWorkoutSignature(workout: IEventBlock): Promise<string> {
    const normalized = pick(workout, ['config', 'info', 'rounds', 'type'])
    const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, JSON.stringify(normalized))

    return digest
}
