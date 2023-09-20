// Description: convert timertype to object config
// Migration version: a4e5bfff4c07
// Created at: 06//07/2023 16:26:19
//
import { Transaction } from '@google-cloud/firestore'
import * as admin from 'firebase-admin'
import { collections } from 'goal-utils'
import { map, pick } from 'radash'

export async function migrate(db: admin.firestore.Firestore) {
    const collectionTempRef = db.collection('temp_worksheets')
    const newCollectionTempRef = db.collection(collections.TEMP_WORKSHEETS)
    const collectionRef = db.collection('worksheets')
    const newCollectionRef = db.collection(collections.WORKSHEETS)

    await db.runTransaction(async (transaction) => {
        await addConvertionToTransaction(transaction, collectionTempRef, newCollectionTempRef)
        await addConvertionToTransaction(transaction, collectionRef, newCollectionRef)
    })
}

export async function rollback(db: admin.firestore.Firestore) {
    throw new Error('No rollbacks')
}

async function addConvertionToTransaction(
    transaction: Transaction,
    oldCollectionRef: admin.firestore.CollectionReference,
    newCollectionRef: admin.firestore.CollectionReference
) {
    const docsSnapshot = await oldCollectionRef.get()

    await map(docsSnapshot.docs, async (worksheetSnapshot) => {
        const worksheetDoc = newCollectionRef.doc(worksheetSnapshot.id)
        transaction.create(worksheetDoc, worksheetSnapshot.data())

        const oldDayCollectionRef = oldCollectionRef.doc(worksheetSnapshot.id).collection(collections.DAYS)
        const oldDaysDocsSnapshot = await oldDayCollectionRef.get()

        const newDayCollectionRef = worksheetDoc.collection(collections.DAYS)

        oldDaysDocsSnapshot.forEach((day) => {
            const oldDayData = day.data()

            const newDayDocRef = newDayCollectionRef.doc(day.id)

            const newData = {
                ...oldDayData,
                periods: oldDayData.periods.map((period: Record<string, any>) => ({
                    ...period,
                    sections: period.sections.map((section: Record<string, any>) => ({
                        ...section,
                        blocks: section.blocks.map((block: Record<string, any>) => {
                            if (block.type !== 'event') return block

                            return {
                                ...pick(block, ['type', 'name', 'info']),
                                rounds: block.rounds.map((round: Record<string, any>) => {
                                    if (round.type === 'rest') return round

                                    const config = createConfig('round', round.type, round)

                                    const roundData: Record<string, any> = {
                                        movements: round.movements,
                                        config,
                                    }

                                    if (round.type === 'complex') roundData.type = 'complex'

                                    return roundData
                                }),
                                config: createConfig('block', block.event_type, block),
                            }
                        }),
                    })),
                })),
            }

            transaction.create(newDayDocRef, newData)
        })
    })
}

function createConfig(block: 'round' | 'block', type: string, data: Record<string, any>): Record<string, any> {
    switch (type) {
        case 'for_time':
        case 'amrap':
            return {
                type: block === 'block' ? data.event_type : data.type,
                timecap: data.timecap,
                numberOfRounds: data.numberOfRounds,
            }
        case 'emom':
            return {
                type: 'emom',
                each: data.each,
                numberOfRounds: data.numberOfRounds,
            }
        case 'tabata':
            return {
                type: 'tabata',
                work: data.work,
                rest: data.rest,
                numberOfRounds: data.numberOfRounds,
            }
        default:
            const config: Record<string, any> = { type: 'not_timed' }
            if (data.numberOfRounds && data.numberOfRounds > 1) config.numberOfRounds = data.numberOfRounds

            return config
    }
}
