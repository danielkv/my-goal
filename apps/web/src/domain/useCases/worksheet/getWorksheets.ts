import dayjs from 'dayjs'
import { IWorksheetModel } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { worksheetConverter } from '@utils/converters'

export async function getWorksheetsUseCase(): Promise<Omit<IWorksheetModel, 'days'>[]> {
    const collectionRef = firebaseProvider
        .firestore()
        .collection(collections.WORKSHEETS)
        .withConverter(worksheetConverter)

    const query = firebaseProvider
        .firestore()
        .query(collectionRef, firebaseProvider.firestore().orderBy('startDate', 'desc'))

    const snapshot = await firebaseProvider.firestore().getDocs(query)

    const worksheets = snapshot.docs.map((doc) => {
        const worksheetData = doc.data()
        const isCurrent = worksheetData.startEndDate
            ? dayjs().isBetween(worksheetData.startEndDate.start, worksheetData.startEndDate.end, 'day', '[]')
            : false

        return {
            ...worksheetData,
            isCurrent,
        }
    })

    return worksheets
}
