import { IWorksheetModel } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { getTempWorksheetDaysUseCase } from '@useCases/temp_days/getTempWorksheetDays'
import { dayConverter, worksheetConverter } from '@utils/converters'

export async function saveTempWorksheetUseCase(worksheet: IWorksheetModel): Promise<IWorksheetModel> {
    if (!worksheet.id) throw new Error('A planilha deve ser salva antes de ter um histórico temporário')

    const fs = firebaseProvider.firestore()

    const docRef = fs.doc(collections.TEMP_WORKSHEETS, worksheet.id).withConverter(worksheetConverter)

    const existingDays = worksheet.id ? await getTempWorksheetDaysUseCase(worksheet.id) : []

    const worksheetResult: IWorksheetModel = await firebaseProvider
        .firestore()
        .runTransaction(firebaseProvider.getFirestore(), async (transaction) => {
            transaction.set(docRef, worksheet)

            const daysResult = worksheet.days.map((day) => {
                if (!day.id) throw new Error('A planilha deve ser salva antes de ter um histórico temporário')

                const dayDocRef = fs
                    .doc(collections.TEMP_WORKSHEETS, docRef.id, 'days', day.id)
                    .withConverter(dayConverter)

                transaction.set(dayDocRef, day)

                return day
            })

            const validIds = daysResult.map((day) => day.id)
            existingDays
                .filter((day) => !validIds.includes(day.id))
                .forEach((day) => {
                    const dayToRemoveRef = fs.doc(collections.TEMP_WORKSHEETS, docRef.id, 'days', day.id)
                    transaction.delete(dayToRemoveRef)
                })

            return worksheet
        })

    return worksheetResult
}
