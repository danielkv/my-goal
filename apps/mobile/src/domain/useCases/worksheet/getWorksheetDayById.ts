import { IDayModel } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

export async function getWorksheetDayByIdFnUseCase(worksheetId: string, dayId: string): Promise<IDayModel> {
    const fs = firebaseProvider.getFirestore()

    const docSnapshot = await fs
        .collection<IDayModel>(`${collections.WORKSHEETS}/${worksheetId}/${collections.DAYS}`)
        .doc(dayId)
        .get()

    const dayData = docSnapshot.data()
    if (!docSnapshot.exists || !dayData) throw new Error('Planilha não encontrada')

    return { ...dayData, id: docSnapshot.id }
}
