import { IUserMovementResult, TResultType } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { getWorkoutResultOrderBy } from '@utils/query/workoutReults'

export async function getMovementHighestScoreUseCase(
    movementId: string,
    userId: string,
    resultType: TResultType
): Promise<IUserMovementResult | null> {
    const fs = firebaseProvider.getFirestore()

    const movementCollection = fs.collection<Omit<IUserMovementResult, 'id'>>(collections.MOVEMENT_RESULTS)

    const query = getWorkoutResultOrderBy(
        movementCollection.where('movementId', '==', movementId).where('uid', '==', userId),
        resultType
    )

    const movementSnapshot = await query.limit(1).get()

    if (movementSnapshot.empty) return null

    return {
        ...movementSnapshot.docs[0].data(),
        id: movementSnapshot.docs[0].id,
    }
}
