const admin = require('firebase-admin')
const data = require('./data.json')
const { omit } = require('radash')
const { faker } = require('@faker-js/faker')

// initialization
const projectId = 'goal-app-e4880'
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
admin.initializeApp({ projectId })

const db = admin.firestore()

function createCollection(collectionRef, data, transaction) {
    Object.entries(data).forEach(([key, values]) => {
        const docRef = collectionRef.doc(key)

        transaction.create(docRef, omit(values, ['__collections__']))

        if (values.__collections__) createSubCollections(docRef, values.__collections__, transaction)
    })
}

function createSubCollections(parentDocRef, __collections__, transaction) {
    Object.entries(__collections__).forEach(([subKey, subValues]) => {
        const subCollectionRef = parentDocRef.collection(subKey)

        createCollection(subCollectionRef, subValues, transaction)
    })
}

// seed function
async function createSeedData() {
    try {
        await db.runTransaction(async (transaction) => {
            if (data.__collections__) {
                createSubCollections(db, data.__collections__, transaction)
            } else {
                const worksheetRef = db.collection('worksheets')
                createCollection(worksheetRef, data, transaction)
            }
        })
    } catch (error) {
        console.log(error, 'database seed failed')
    }
}

createSeedData()
