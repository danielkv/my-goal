import { IMovement } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

export async function getMovementByIdUseCase(movementId: string): Promise<IMovement> {
    const fs = firebaseProvider.getFirestore()

    const movementCollection = fs.collection<Omit<IMovement, 'id'>>(collections.MOVEMENTS)

    const movementSnapshot = await movementCollection.doc(movementId).get()

    const data = movementSnapshot.data()

    if (!data || !movementSnapshot.exists) throw new Error('Movimento não existe')

    return {
        ...data,
        id: movementSnapshot.id,
    }
}
