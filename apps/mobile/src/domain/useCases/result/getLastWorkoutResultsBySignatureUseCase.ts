import { IUserWorkoutResult, IUserWorkoutResultResponse } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { getWorkoutResultFilters, mergeWorkoutResultAndUser } from '@utils/query/workoutReults'

export async function getLastWorkoutResultsBySignatureUseCase(
    userId: string,
    workoutSignature: string,
    limit = 10,
    onlyMe = false
): Promise<IUserWorkoutResultResponse[]> {
    const fs = firebaseProvider.getFirestore()

    const collectionRef = fs.collection<IUserWorkoutResult>(collections.WORKOUT_RESULTS)

    const query = getWorkoutResultFilters(collectionRef.where('workoutSignature', '==', workoutSignature), {
        onlyMe,
        userId,
    })

    const resultsSnapshot = await query.orderBy('date', 'desc').limit(limit).get({ source: 'server' })

    if (resultsSnapshot.empty) return []

    const results = await mergeWorkoutResultAndUser(resultsSnapshot.docs)

    return results
}
