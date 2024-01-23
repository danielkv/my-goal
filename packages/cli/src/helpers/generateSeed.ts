import admin from 'firebase-admin'
import fs from 'fs'
import { promisify } from 'node:util'
import path from 'path'
import { map } from 'radash'

const writeFileAsync = promisify(fs.writeFile)

async function generateWorksheets() {
    const db = admin.firestore()

    const collection = db.collection('worksheets')

    const worksheets = await collection.get()

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

async function generateMovements() {
    const db = admin.firestore()

    const collection = db.collection('movements')

    const movements = await collection.get()

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

export async function generateSeed(filePath: string) {
    const sqlFile = path.resolve(__dirname, filePath)
    const worksheetsSql = await generateWorksheets()
    const movementSql = await generateMovements()

    const fileContent = `${worksheetsSql}\n\n${movementSql}`

    await writeFileAsync(sqlFile, fileContent)
}

const stringifyRow = (row: Record<string, any>) =>
    Object.values(row).map((value) => (typeof value === 'string' ? `'${value}'` : value))

function generateSql(table: string, fields: string[], data: Record<string, any>[]) {
    const header = `INSERT INTO ${table} (${fields.join(`,`)}) VALUES`

    const values = data.map((row) => `(${stringifyRow(row)})`).join(',\n')

    return `${header}\n${values};`
}
