import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

export async function removeTempWorksheetUseCase(worksheetId: string): Promise<void> {
    const docRef = firebaseProvider.firestore().doc(collections.TEMP_WORKSHEETS, worksheetId)

    await firebaseProvider.firestore().deleteDoc(docRef)
}
