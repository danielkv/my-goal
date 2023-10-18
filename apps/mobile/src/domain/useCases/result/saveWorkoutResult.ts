import { ANALYTICS_EVENTS, IUserWorkoutResultInput } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

export async function saveWorkoutResult(result: Omit<IUserWorkoutResultInput, 'createdAt'>): Promise<void> {
    const fs = firebaseProvider.getFirestore()
    const collectionRef = fs.collection<IUserWorkoutResultInput>(collections.WORKOUT_RESULTS)

    const dataAdd: IUserWorkoutResultInput = {
        ...result,
        createdAt: new Date().toISOString(),
    }

    await firebaseProvider.getAnalytics().logEvent(ANALYTICS_EVENTS.SAVE_WORKOUT_RESULT)
    await collectionRef.add(dataAdd)
}
