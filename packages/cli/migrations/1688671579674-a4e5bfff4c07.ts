// Description: convert timertype to object config
// Migration version: a4e5bfff4c07
// Created at: 06//07/2023 16:26:19
//
import { Transaction } from '@google-cloud/firestore'
import * as admin from 'firebase-admin'
import { map } from 'radash'

export async function migrate(db: admin.firestore.Firestore) {
    const collectionTempRef = db.collection('temp_worksheets')
    const collectionRef = db.collection('worksheets')

    await db.runTransaction(async (transaction) => {
        await addConvertionToTransaction(transaction, collectionTempRef)
        await addConvertionToTransaction(transaction, collectionRef)
    })
}

export async function rollback(db: admin.firestore.Firestore) {
    throw new Error('No rollbacks')
}

async function addConvertionToTransaction(
    transaction: Transaction,
    collectionRef: admin.firestore.CollectionReference
) {
    const docsSnapshot = await collectionRef.get()

    await map(docsSnapshot.docs, async (worksheetSnapshot) => {
        const dayCollectionRef = collectionRef.doc(worksheetSnapshot.id).collection('days')
        const daysDocsSnapshot = await dayCollectionRef.get()

        daysDocsSnapshot.forEach((day) => {
            const dayData = day.data()

            const docRef = dayCollectionRef.doc(day.id)

            const newData = {
                ...dayData,
                periods: dayData.periods.map((period: Record<string, any>) => ({
                    ...period,
                    sections: period.sections.map((section: Record<string, any>) => ({
                        ...section,
                        blocks: section.blocks.map((block: Record<string, any>) => {
                            if (block.type !== 'event') return block

                            return {
                                ...block,
                                rounds: block.rounds.map((round: Record<string, any>) => {
                                    if (round.type === 'rest') return round

                                    const roundData: Record<string, any> = {
                                        ...round,
                                        config: createConfig(round.type, round),
                                    }

                                    if (round.type === 'complex') roundData.type = 'complex'

                                    return roundData
                                }),
                                config: createConfig(block.event_type, block),
                            }
                        }),
                    })),
                })),
            }

            transaction.update(docRef, newData)
        })
    })
}

function createConfig(type: string, data: Record<string, any>): Record<string, any> {
    switch (type) {
        case 'for_time':
        case 'amrap':
            return {
                type: data.event_type,
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
