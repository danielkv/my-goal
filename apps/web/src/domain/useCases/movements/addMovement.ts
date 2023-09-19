import { IMovement, IMovementInput } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { movementConverter } from '@utils/converters'

export async function addMovementUseCase(movementInput: IMovementInput) {
    const collectionRef = firebaseProvider
        .firestore()
        .collection(collections.MOVEMENTS)
        .withConverter(movementConverter)

    const movement: Omit<IMovement, 'id'> = {
        ...movementInput,
        countResults: 0,
    }

    await firebaseProvider.firestore().addDoc(collectionRef, movement)
}
