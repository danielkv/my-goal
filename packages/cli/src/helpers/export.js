const { firestoreExport } = require('node-firestore-import-export')
const path = require('node:path')
const fs = require('node:fs')
const admin = require('firebase-admin')

module.exports = async function exportData(filePath, optionCollectionName) {
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
            __collections__: collectionsData.reduce((final, [name, value]) => {
                final[name] = value
                return final
            }, {}),
        }

        return fs.writeFileSync(filePath, JSON.stringify(dataToSave), { encoding: 'utf-8' })
    } else {
        if (!collectionsDoc.some((collection) => collection.id === optionCollectionName))
            throw new Error('Collection Path does not exist')

        const collectionRef = db.collection(optionCollectionName)

        const dataToSave = await firestoreExport(collectionRef)

        return fs.writeFileSync(filePath, JSON.stringify(dataToSave), { encoding: 'utf-8' })
    }
}
