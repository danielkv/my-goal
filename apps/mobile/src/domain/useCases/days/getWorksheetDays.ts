import { IDayModel } from 'goal-models'

import { firebaseProvider } from '@common/providers/firebase'

export async function getWorksheetDaysUseCase(worksheetId: string): Promise<IDayModel[]> {
    const collectionRef = firebaseProvider.getFirestore().collection<IDayModel>(`worksheets/${worksheetId}/days`)

    const daysSnapshot = await collectionRef.orderBy('date').get()

    return daysSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
}
