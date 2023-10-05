import { IWorksheetModel } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { getWorksheetDaysUseCase } from '@useCases/days/getWorksheetDays'

export async function getWorksheetByIdUseCase(worksheetId: string): Promise<IWorksheetModel> {
    const fs = firebaseProvider.getFirestore()

    const docSnapshot = await fs.collection<IWorksheetModel>(collections.WORKSHEETS).doc(worksheetId).get()

    const worksheetData = docSnapshot.data()
    if (!docSnapshot.exists || !worksheetData) throw new Error('Planilha não encontrada')

    if (!worksheetData.published) throw new Error('Planilha não encontrada')

    const days = await getWorksheetDaysUseCase(worksheetId)

    return { ...worksheetData, days, id: docSnapshot.id }
}
