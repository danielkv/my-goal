import { IDayModel } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

export async function getWorksheetDaysUseCase(worksheetId: string): Promise<IDayModel[]> {
    const collectionRef = firebaseProvider
        .getFirestore()
        .collection<IDayModel>(`${collections.WORKSHEETS}/${worksheetId}/${collections.DAYS}`)

    const daysSnapshot = await collectionRef.orderBy('date').get()

    return daysSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
}
