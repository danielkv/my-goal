import { firebaseProvider } from '@common/providers/firebase'
import { IWorksheetModel } from '@models/day'

export function getWorksheetListUseCase(): Promise<IWorksheetModel[]> {
    const fs = firebaseProvider.getFirestore()

    return fs
        .collection<IWorksheetModel>('worksheets')
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
