import * as dayjs from 'dayjs'
import * as isBetween from 'dayjs/plugin/isBetween'
import * as admin from 'firebase-admin'
import { https } from 'firebase-functions'
import { map } from 'radash'

import { init } from '../../helpers'
import { getDays } from '../../utils/getDays'

dayjs.extend(isBetween)

init()

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

// export const remapWorksheets = https.onRequest(async (req, res) => {
//     const db = admin.firestore()

//     const snapshot = await db.collection('worksheets').get()

//     await db.runTransaction(async (transaction) => {
//         for (let i = 0; i < snapshot.size; i++) {
//             const doc = snapshot.docs[i]

//             const dayDocs = await db.collection(`worksheets/${doc.id}/days`).get()

//             dayDocs.forEach((dayDoc) => {
//                 const final = dayDoc.data()

//                 final.periods = final.periods.map((period: Record<string, any>) => {
//                     if (period.groups?.length) period.sections = [...period.groups]
//                     delete period.groups

//                     return period
//                 })

//                 transaction.set(dayDoc.ref, final)
//             })
//         }
//     })

//     res.status(201).send('OK')
// })
