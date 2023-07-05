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

// seed function
async function createSeedData() {
    try {
        await db.runTransaction(async (transaction) => {
            const worksheetRef = db.collection('worksheets')

            data.map((worksheet) => {
                const worksheetDocRef = worksheetRef.doc()

                transaction.create(worksheetDocRef, omit(worksheet, ['days']))

                const dayRef = worksheetDocRef.collection('days')

                worksheet.days.forEach((day) => {
                    const dayDocRef = dayRef.doc()
                    transaction.create(dayDocRef, day)
                })
            })
        })

        await db.runTransaction(async (transaction) => {
            const worksheetRef = db.collection('worksheets')

            data.map((worksheet) => {
                const worksheetDocRef = worksheetRef.doc()

                transaction.create(worksheetDocRef, omit(worksheet, ['days']))

                const dayRef = worksheetDocRef.collection('days')

                worksheet.days.forEach((day) => {
                    const dayDocRef = dayRef.doc()
                    transaction.create(dayDocRef, day)
                })
            })
        })

        const user = await admin.auth().createUser({
            displayName: 'Daniel Guolo',
            email: 'danielkv@gmail.com',
            password: '123456',
            emailVerified: true,
        })
        admin.auth().setCustomUserClaims(user.uid, { admin: true })

        const promises = Array.from({ length: 8 }).map(() => {
            return admin.auth().createUser({
                displayName: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            })
        })

        await Promise.all(promises)

        console.log('database seed was successful')
    } catch (error) {
        console.log(error, 'database seed failed')
    }
}

createSeedData()
