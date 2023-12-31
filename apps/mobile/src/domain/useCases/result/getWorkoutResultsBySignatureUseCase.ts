import { IUserWorkoutResult, IUserWorkoutResultResponse, TResultType } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { getWorkoutResultFilters, getWorkoutResultOrderBy, mergeWorkoutResultAndUser } from '@utils/query/workoutReults'

export async function getWorkoutResultsBySignatureUseCase(
    userId: string,
    workoutSignature: string,
    resultType: TResultType | null,
    startAfter?: string | null,
    limit = 10,
    onlyMe = false
): Promise<IUserWorkoutResultResponse[]> {
    const fs = firebaseProvider.getFirestore()

    const collectionRef = fs.collection<Omit<IUserWorkoutResult, 'id'>>(collections.WORKOUT_RESULTS)

    let query = getWorkoutResultFilters(collectionRef.where('workoutSignature', '==', workoutSignature), {
        onlyMe,
        userId,
    })

    let type = resultType

    if (!type) {
        const docSnapshot = await collectionRef.where('workoutSignature', '==', workoutSignature).limit(1).get()
        if (docSnapshot.empty) return []
        type = docSnapshot.docs[0].data().result.type
    }

    query = getWorkoutResultOrderBy(query, type).orderBy('date', 'desc')

    if (startAfter) {
        const startAfterSnapshot = await collectionRef.doc(startAfter).get()
        query = query.startAfter(startAfterSnapshot)
    }

    const resultsSnapshot = await query.limit(limit).get({ source: 'server' })

    if (resultsSnapshot.empty) return []

    const results = await mergeWorkoutResultAndUser(resultsSnapshot.docs)

    return results
}
