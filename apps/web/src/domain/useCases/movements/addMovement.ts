import { IMovementInput } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { movementConverter } from '@utils/converters'

export async function addMovementUseCase(movementInput: IMovementInput) {
    const collectionRef = firebaseProvider
        .firestore()
        .collection(collections.MOVEMENTS)
        .withConverter(movementConverter)

    await firebaseProvider.firestore().addDoc(collectionRef, movementInput)
}
