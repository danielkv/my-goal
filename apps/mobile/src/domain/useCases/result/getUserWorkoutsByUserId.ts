import { IUserWorkoutResult } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

export async function getUserWorkoutsByUserIdUseCase(
    userId: string,
    startAfter?: string | null,
    limit = 10
): Promise<IUserWorkoutResult[]> {
    const fs = firebaseProvider.getFirestore()

    const collectionRef = fs.collection<Omit<IUserWorkoutResult, 'id'>>(collections.WORKOUT_RESULTS)

    let query = collectionRef.where('uid', '==', userId).orderBy('createdAt', 'desc')

    if (startAfter) {
        const startAfterSnapshot = await collectionRef.doc(startAfter).get()
        query = query.startAfter(startAfterSnapshot)
    }

    const resultsSnapshot = await query.limit(limit).get()

    const results = resultsSnapshot.docs.map<IUserWorkoutResult>((doc) => ({ ...doc.data(), id: doc.id }))

    return results
}
