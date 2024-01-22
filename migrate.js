require('dotenv/config')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
const admin = require('firebase-admin')
const { getFirestore } = require('firebase-admin/firestore')
const { map } = require('radash')

const fbApp = admin.initializeApp({
    credential: admin.credential.cert(path.resolve(__dirname, 'packages/cli/service-account.cert.json')),
})

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const client = createClient(supabaseUrl, serviceKey)

async function migrateWorksheets() {
    const db = getFirestore(fbApp)

    const collection = db.collection('worksheets')

    const worksheets = await collection.get()

    console.log(worksheets.docs.length, 'planilhas encontradas')

    const newDocs = await map(worksheets.docs, async (doc) => {
        const days = await collection.doc(doc.id).collection('days').get()

        const data = doc.data()

        return {
            name: data.name,
            published: data.published,
            startDate: data.startEndDate.start,
            endDate: data.startEndDate.end,
            days: days.docs.map((day) => day.data()),
        }
    })

    const { error } = await client.from('worksheets').insert(newDocs)

    if (error) return console.log('ERRO:', error.message)

    console.log(newDocs.length, 'planilhas inseridas')
}

async function migrateMovements() {
    const db = getFirestore(fbApp)

    const collection = db.collection('movements')

    const movements = await collection.get()

    console.log(movements.docs.length, 'movimentos encontrados')

    const newDocs = await map(movements.docs, async (doc) => {
        const data = doc.data()

        return {
            movement: data.movement,
            resultType: data.resultType,
            countResults: 0,
            fb_old_id: doc.id,
        }
    })

    const { error } = await client.from('movements').insert(newDocs)

    if (error) return console.log('ERRO:', error.message)

    console.log(newDocs.length, 'movimentos inseridos')
}

async function migrate() {
    await migrateWorksheets()
    await migrateMovements()
}

migrate()
