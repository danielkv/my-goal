import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { movementConverter } from '@utils/converters'

export async function removeMovementUseCase(movementId: string) {
    const documentRef = firebaseProvider
        .firestore()
        .doc(collections.MOVEMENTS, movementId)
        .withConverter(movementConverter)

    await firebaseProvider.firestore().deleteDoc(documentRef)
}
