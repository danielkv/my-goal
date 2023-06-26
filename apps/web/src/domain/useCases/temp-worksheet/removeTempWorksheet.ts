import { firebaseProvider } from '@common/providers/firebase'

export async function removeTempWorksheetUseCase(worksheetId: string): Promise<void> {
    const docRef = firebaseProvider.firestore().doc('temp_worksheets', worksheetId)

    await firebaseProvider.firestore().deleteDoc(docRef)
}
