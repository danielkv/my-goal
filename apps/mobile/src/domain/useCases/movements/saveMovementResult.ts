import { IUserMovementResultInput } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

export async function saveMovementResult(result: Omit<IUserMovementResultInput, 'createdAt'>): Promise<void> {
    const fs = firebaseProvider.getFirestore()
    const collectionRef = fs.collection<IUserMovementResultInput>(collections.MOVEMENT_RESULTS)

    const dataAdd: IUserMovementResultInput = {
        ...result,
        createdAt: new Date().toISOString(),
    }

    await collectionRef.add(dataAdd)
}
