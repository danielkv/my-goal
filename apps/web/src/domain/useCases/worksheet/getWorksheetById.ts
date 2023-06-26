import dayjs from 'dayjs'

import { firebaseProvider } from '@common/providers/firebase'
import { IWorksheetModel } from '@models/day'
import { getWorksheetDaysUseCase } from '@useCases/days/getWorksheetDays'
import { worksheetConverter } from '@utils/converters'

export async function getWorksheetByIdUseCase(worksheetId: string): Promise<IWorksheetModel> {
    const collectionRef = firebaseProvider.firestore().doc('worksheets', worksheetId).withConverter(worksheetConverter)

    const snapshot = await firebaseProvider.firestore().getDoc(collectionRef)
    if (!snapshot.exists()) throw new Error('Planilha não encontrada')

    const days = await getWorksheetDaysUseCase(worksheetId)
    const worksheetData = snapshot.data()

    const isCurrent = worksheetData.startEndDate
        ? dayjs().isBetween(worksheetData.startEndDate.start, worksheetData.startEndDate.end, 'day', '[]')
        : false

    return {
        ...worksheetData,
        isCurrent,
        days,
    }
}
