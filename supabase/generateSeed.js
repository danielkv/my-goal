const path = require('path')
const fs = require('fs')
const { promisify } = require('node:util')
const admin = require('firebase-admin')
const { getFirestore } = require('firebase-admin/firestore')
const { map } = require('radash')

const writeFileAsync = promisify(fs.writeFile)

const fbApp = admin.initializeApp({
    credential: admin.credential.cert(path.resolve(__dirname, '..', 'packages/cli/service-account.cert.json')),
})

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
            days: JSON.stringify(days.docs.map((day) => day.data())),
        }
    })

    const sql = generateSql('worksheets', ['name', 'published', '"startDate"', '"endDate"', 'days'], newDocs)

    console.log(newDocs.length, 'planilhas exportadas')
    return sql
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

    console.log(newDocs.length, 'movimentos exportados')

    return generateSql('movements', ['movement', '"resultType"', '"countResults"', 'fb_old_id'], newDocs)
}

async function migrate() {
    const sqlFile = path.resolve(__dirname, 'seed.sql')
    const worksheetsSql = await migrateWorksheets()
    const movementSql = await migrateMovements()

    const fileContent = `${worksheetsSql}\n\n${movementSql}`

    await writeFileAsync(sqlFile, fileContent)

    // await migrateMovements()
}

const stringifyRow = (row) => Object.values(row).map((value) => (typeof value === 'string' ? `'${value}'` : value))

function generateSql(table, fields, data) {
    const header = `INSERT INTO ${table} (${fields.join(`,`)}) VALUES`

    const values = data.map((row) => `(${stringifyRow(row)})`).join(',\n')

    return `${header}\n${values};`
}

migrate()
