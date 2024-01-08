import { IWorksheetModel } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

const LIMIT_DATE = '2024-01-08'

export function getWorksheetListUseCase(): Promise<IWorksheetModel[]> {
    const fs = firebaseProvider.getFirestore()

    return fs
        .collection<IWorksheetModel>(collections.WORKSHEETS)
        .orderBy('startDate', 'desc')
        .where('startDate', '<=', LIMIT_DATE)
        .where('published', '==', true)
        .get({ source: 'server' })
        .then((snapshot) => {
            const worksheets = snapshot.docs.map((doc) => {
                const worksheetData = doc.data()

                return {
                    ...worksheetData,
                    id: doc.id,
                }
            })

            return worksheets
        })
}
