import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { movementConverter } from '@utils/converters'

export async function getMovementsUseCase() {
    const collectionRef = firebaseProvider
        .firestore()
        .collection(collections.MOVEMENTS)
        .withConverter(movementConverter)

    const query = firebaseProvider
        .firestore()
        .query(collectionRef, firebaseProvider.firestore().orderBy('movement_insensitive', 'asc'))

    const snapshot = await firebaseProvider.firestore().getDocs(query)

    return snapshot.docs.map((doc) => doc.data())
}
