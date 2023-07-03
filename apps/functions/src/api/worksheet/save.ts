import { init } from '../../helpers'
import { getDays } from '../../utils/getDays'
import * as admin from 'firebase-admin'
import { https } from 'firebase-functions'

init()

/**
 * @Deprecated
 */
export const duplicateWorksheet = https.onCall(async (worksheetId: string) => {
    const db = admin.firestore()
    const collection = db.collection('worksheets')
    const doc = await collection.doc(worksheetId).get()
    if (!doc.exists) throw new Error('Worksheet not found')

    const worksheet: Record<string, any> = {
        days: await getDays(doc.ref),
        ...doc.data(),
        published: false,
    }

    delete worksheet.id
    worksheet.name = `Cópia de ${worksheet.name}`
    if (worksheet.days) {
        worksheet.days.map((day: Record<string, any>) => {
            delete day.id
            return day
        })
    } else {
        worksheet.days = []
    }

    return createWorksheetUseCase(worksheet)
})

/**
 * @Deprecated
 */
export const removeWorksheet = https.onCall(async (worksheetId: string) => {
    const db = admin.firestore()
    const collection = db.collection('worksheets')
    await collection.doc(worksheetId).delete()
})

/**
 * @Deprecated
 */
export const saveWorksheet = https.onCall((worksheet: Record<string, any>, context: https.CallableContext) => {
    return createWorksheetUseCase(worksheet)
})

/**
 * @Deprecated
 */
function createWorksheetUseCase({ days, ...worksheet }: Record<string, any>) {
    const db = admin.firestore()

    return db.runTransaction(async (transaction) => {
        const worksheetRef = db.collection('worksheets')

        const worksheetDocRef = worksheet.id ? worksheetRef.doc(worksheet.id) : worksheetRef.doc()

        if (!worksheet.id) {
            transaction.create(worksheetDocRef, worksheet)
        } else {
            transaction.update(worksheetDocRef, worksheet)
        }

        const createdDays = await saveDaysUseCase(transaction, worksheetDocRef, days)

        return {
            id: worksheetDocRef.id,
            days: createdDays,
            ...worksheet,
        }
    })
}

/**
 * @Deprecated
 */
async function saveDaysUseCase(
    transaction: admin.firestore.Transaction,
    worksheetRef: admin.firestore.DocumentReference,
    days: Record<string, any>[]
) {
    const dayRef = worksheetRef.collection('days')

    // clear all docs from days
    const currentDocs = await dayRef.listDocuments()

    currentDocs.forEach((doc) => {
        transaction.delete(doc)
    })

    days.forEach((day) => {
        const dayDocRef = dayRef.doc()
        transaction.create(dayDocRef, day)
    })

    return days
}

/**
 * @Deprecated
 */
export const toggleWorksheetPublished = https.onCall(async (worksheetId: string) => {
    const db = admin.firestore()
    const doc = db.collection('worksheets').doc(worksheetId)

    const ref = await doc.get()

    const data = ref.data()
    if (!data) throw new Error('Erro ao buscar planilha')

    await doc.update({
        ...data,
        published: !data.published,
    })
})

/**
 * @Deprecated
 */
export const createInitialLoad = https.onRequest(async (req, res) => {
    if (!process.env.FUNCTIONS_EMULATOR) {
        res.sendStatus(404)
        return
    }

    const promises = req.body.map((worksheet: Record<string, any>) => createWorksheetUseCase(worksheet))

    await Promise.all(promises)

    res.sendStatus(201)
})
