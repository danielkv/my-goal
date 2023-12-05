import { ANALYTICS_EVENTS, IUserMovementResultInput } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

export async function saveMovementResultUseCase(result: Omit<IUserMovementResultInput, 'createdAt'>): Promise<void> {
    const fs = firebaseProvider.getFirestore()
    const collectionRef = fs.collection<IUserMovementResultInput>(collections.MOVEMENT_RESULTS)

    const dataAdd: IUserMovementResultInput = {
        ...result,
        createdAt: new Date().toISOString(),
    }

    await firebaseProvider.getAnalytics().logEvent(ANALYTICS_EVENTS.SAVE_PR)
    await collectionRef.add(dataAdd)
}
