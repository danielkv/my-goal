import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

export async function removeWorksheetUseCase(worksheetId: string): Promise<void> {
    const docRef = firebaseProvider.firestore().doc(collections.WORKSHEETS, worksheetId)

    await firebaseProvider.firestore().deleteDoc(docRef)
}
