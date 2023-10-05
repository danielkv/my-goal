import { IUserMovementResultInput } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

export async function removeMovementResultUseCase(movementResultId: string): Promise<void> {
    const fs = firebaseProvider.getFirestore()
    const collectionRef = fs.collection<IUserMovementResultInput>(collections.MOVEMENT_RESULTS)

    await collectionRef.doc(movementResultId).delete()
}
