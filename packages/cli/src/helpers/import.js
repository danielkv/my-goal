const { firestoreImport } = require('node-firestore-import-export')
const fs = require('node:fs')
const admin = require('firebase-admin')

module.exports = function importData(filePath, optionCollectionName) {
    if (!fs.existsSync(filePath)) throw new Error('Data File does not exist')

    const data = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }))

    const db = admin.firestore()

    if (data.__collections__) {
        const promises = Object.entries(data.__collections__).map(([collectionName, data]) => {
            const collectionRef = db.collection(collectionName)
            return firestoreImport(data, collectionRef)
        })
        return Promise.all(promises)
    } else {
        if (!optionCollectionName) throw new Error('You need to set a collection name')
        const collectionRef = db.collection(optionCollectionName)
        return firestoreImport(data, collectionRef)
    }
}
