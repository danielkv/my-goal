import { IUserMovementResult, IUserMovementResultResponse, TResultType } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { getWorkoutResultFilters, getWorkoutResultOrderBy, mergeWorkoutResultAndUser } from '@utils/query/workoutReults'

export async function getMovementResultsByUserIdUseCase(
    userId: string,
    movementId: string,
    resultType: TResultType,
    startAfter?: string | null,
    limit = 10,
    onlyMe = false
): Promise<IUserMovementResultResponse[]> {
    const fs = firebaseProvider.getFirestore()

    const movementCollection = fs.collection<Omit<IUserMovementResult, 'id'>>(collections.MOVEMENT_RESULTS)

    let query = getWorkoutResultOrderBy(
        getWorkoutResultFilters(movementCollection.where('movementId', '==', movementId), { onlyMe, userId }),
        resultType
    ).orderBy('date', 'desc')

    if (startAfter) {
        const startAfterSnapshot = await movementCollection.doc(startAfter).get()
        query = query.startAfter(startAfterSnapshot)
    }

    const movementSnapshot = await query.limit(limit).get()

    if (movementSnapshot.empty) return []

    const results = await mergeWorkoutResultAndUser(movementSnapshot.docs)

    return results
}
