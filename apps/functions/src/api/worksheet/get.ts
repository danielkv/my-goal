import { init } from '../../helpers'
import { getDays } from '../../utils/getDays'
import * as dayjs from 'dayjs'
import * as isBetween from 'dayjs/plugin/isBetween'
import * as admin from 'firebase-admin'
import { https } from 'firebase-functions'
import { map } from 'radash'

dayjs.extend(isBetween)

init()

/**
 * @Deprecated
 */
export const getWorksheetById = https.onCall(async (worksheetId: string, context: https.CallableContext) => {
    const db = admin.firestore()

    const collection = db.collection('worksheets')

    const doc = await collection.doc(worksheetId).get()

    if (!doc.exists) throw new Error('Worksheet not found')

    return {
        id: doc.id,
        days: await getDays(doc.ref),
        ...doc.data(),
    }
})

type GetWorksheetDayByIdData = { worksheetId: string; dayId: string }

/**
 * @Deprecated
 */
export const getWorksheetDayById = https.onCall(async ({ dayId, worksheetId }: GetWorksheetDayByIdData) => {
    const db = admin.firestore()

    const collection = db.collection(`worksheets/${worksheetId}/days`)

    const doc = await collection.doc(dayId).get()

    if (!doc.exists) throw new Error('Worksheet day not found')

    return {
        id: doc.id,
        ...doc.data(),
    }
})

type TGetWorksheetsFilter = {
    includeNotPublished?: boolean
}
/**
 * @Deprecated
 */
export const getWorksheets = https.onCall(async (filter?: TGetWorksheetsFilter) => {
    const db = admin.firestore()

    const collection = db.collection('worksheets')

    let query = collection.orderBy('startDate', 'desc')

    if (!filter?.includeNotPublished) query = query.where('published', '==', true)

    const snapshot = await query.get()

    const results = await map(snapshot.docs, async (doc) => {
        const days = await getDays(doc.ref)

        let firstDate: string = ''
        let lastDate: string = ''

        days.forEach((day, index) => {
            if (index === 0) firstDate = day.date
            lastDate = day.date
        })

        const isCurrent = dayjs().isBetween(dayjs(firstDate), dayjs(lastDate), 'day', '[]')

        return {
            id: doc.id,
            isCurrent,
            ...doc.data(),
        }
    })

    return results
})
