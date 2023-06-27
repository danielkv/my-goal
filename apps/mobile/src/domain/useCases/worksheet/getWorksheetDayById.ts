import { IDayModel } from 'goal-models'

import { firebaseProvider } from '@common/providers/firebase'

export async function getWorksheetDayByIdFnUseCase(worksheetId: string, dayId: string): Promise<IDayModel> {
    const fs = firebaseProvider.getFirestore()

    const docSnapshot = await fs.collection<IDayModel>(`worksheets/${worksheetId}/days`).doc(dayId).get()

    const dayData = docSnapshot.data()
    if (!docSnapshot.exists || !dayData) throw new Error('Planilha não encontrada')

    return { ...dayData, id: docSnapshot.id }
}
