import { IDayModel, IWorksheet, IWorksheetModel } from 'goal-models'
import { collections } from 'goal-utils'
import { omit } from 'radash'

import { firebaseProvider } from '@common/providers/firebase'
import { getWorksheetDaysUseCase } from '@useCases/days/getWorksheetDays'
import { dayConverter, worksheetConverter } from '@utils/converters'
import { newId } from '@utils/newId'

export async function saveWorksheetUseCase(worksheet: IWorksheet): Promise<IWorksheetModel> {
    const worksheetId = worksheet.id || newId()
    const docRef = firebaseProvider
        .firestore()
        .doc(collections.WORKSHEETS, worksheetId)
        .withConverter(worksheetConverter)

    const existingDays = worksheet.id ? await getWorksheetDaysUseCase(worksheet.id) : []

    const worksheetResult: IWorksheetModel = await firebaseProvider
        .firestore()
        .runTransaction(firebaseProvider.getFirestore(), async (transaction) => {
            const startEndDate = {
                start: worksheet.days.at(0)?.date || '',
                end: worksheet.days.at(-1)?.date || '',
            }

            transaction.set(docRef, { ...worksheet, startEndDate, id: '' })

            const daysResult = worksheet.days.map<IDayModel>((day, index) => {
                const dayId = day.id || newId()
                const dayDocRef = firebaseProvider
                    .firestore()
                    .doc(collections.WORKSHEETS, docRef.id, 'days', dayId)
                    .withConverter(dayConverter)
                transaction.set(dayDocRef, day)

                return {
                    ...omit(day, ['id']),
                    id: dayId,
                }
            })

            const validIds = daysResult.map((day) => day.id)
            existingDays
                .filter((day) => !validIds.includes(day.id))
                .forEach((day) => {
                    const dayToRemoveRef = firebaseProvider
                        .firestore()
                        .doc(collections.WORKSHEETS, docRef.id, 'days', day.id)
                    transaction.delete(dayToRemoveRef)
                })

            return { ...worksheet, days: daysResult, id: worksheetId, startEndDate }
        })

    return worksheetResult
}
