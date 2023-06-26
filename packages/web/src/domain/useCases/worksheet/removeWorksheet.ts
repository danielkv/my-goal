import { firebaseProvider } from '@common/providers/firebase'

export async function removeWorksheetUseCase(worksheetId: string): Promise<void> {
    const docRef = firebaseProvider.firestore().doc('worksheets', worksheetId)

    await firebaseProvider.firestore().deleteDoc(docRef)
}
