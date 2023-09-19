import { IMovement } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { movementConverter } from '@utils/converters'

export async function updateMovementUseCase(movementId: string, movement: IMovement) {
    const documentRef = firebaseProvider
        .firestore()
        .doc(collections.MOVEMENTS, movementId)
        .withConverter(movementConverter)

    await firebaseProvider.firestore().updateDoc(documentRef, documentRef.converter?.toFirestore(movement))
}
