import dayjs from 'dayjs'
import { IWorksheetModel } from 'goal-models'

import { firebaseProvider } from '@common/providers/firebase'
import { getTempWorksheetDaysUseCase } from '@useCases/temp_days/getTempWorksheetDays'
import { worksheetConverter } from '@utils/converters'

export async function getTempWorksheetByIdUseCase(worksheetId: string): Promise<IWorksheetModel | null> {
    const collectionRef = firebaseProvider
        .firestore()
        .doc('temp_worksheets', worksheetId)
        .withConverter(worksheetConverter)

    const snapshot = await firebaseProvider.firestore().getDoc(collectionRef)
    if (!snapshot.exists()) return null

    const days = await getTempWorksheetDaysUseCase(worksheetId)
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
