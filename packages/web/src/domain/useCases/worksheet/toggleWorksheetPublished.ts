import { firebaseProvider } from '@common/providers/firebase'

export async function toggleWorksheetPublishedUseCase(worksheetId: string, currentState: boolean): Promise<void> {
    const docRef = firebaseProvider.firestore().doc('worksheets', worksheetId)
    await firebaseProvider.firestore().setDoc(docRef, { published: !currentState }, { merge: true })
}
