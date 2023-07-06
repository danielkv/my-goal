import { CollectionData, CollectionValue } from '../types/exports'
import * as admin from 'firebase-admin'
import { firestoreExport } from 'node-firestore-import-export'
import fs from 'node:fs'

export default async function exportData(filePath: string, optionCollectionName?: string) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    const db = admin.firestore()

    const collectionsDoc = await db.listCollections()
    if (!optionCollectionName) {
        const promises = collectionsDoc.map(async (collectionRef) => {
            const name = collectionRef.id
            const data = await firestoreExport(collectionRef)
            return [name, data]
        })
        const collectionsData = await Promise.all(promises)

        const dataToSave = {
            __collections__: collectionsData.reduce<CollectionData>((final, [name, value]) => {
                final[name] = value
                return final
            }, {}),
        }

        return fs.writeFileSync(filePath, JSON.stringify(dataToSave), { encoding: 'utf-8' })
    } else {
        if (!collectionsDoc.some((collection) => collection.id === optionCollectionName))
            throw new Error('Collection Path does not exist')

        const collectionRef = db.collection(optionCollectionName)

        const dataToSave: CollectionValue = await firestoreExport(collectionRef)

        return fs.writeFileSync(filePath, JSON.stringify(dataToSave), { encoding: 'utf-8' })
    }
}
