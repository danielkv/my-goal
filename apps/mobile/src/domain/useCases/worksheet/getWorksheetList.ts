import { IWorksheetModel } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'

export function getWorksheetListUseCase(): Promise<IWorksheetModel[]> {
    const fs = firebaseProvider.getFirestore()

    return fs
        .collection<IWorksheetModel>(collections.WORKSHEETS)
        .orderBy('startDate', 'desc')
        .where('published', '==', true)
        .get()
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
