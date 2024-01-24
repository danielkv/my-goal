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

    const allDays: Record<string, any>[] = []

    const newDocs = await map(worksheets.docs, async (doc, index) => {
        const worksheetId = index + 1
        const days = await collection.doc(doc.id).collection('days').get()

        const mappedDays = days.docs.map((day) => {
            const data = day.data()
            return { '"worksheetId"': worksheetId, ...data, periods: JSON.stringify(data.periods) }
        })

        allDays.push(...mappedDays)

        const data = doc.data()

        return {
            id: worksheetId,
            name: data.name,
            published: data.published,
            '"startDate"': data.startEndDate.start,
            '"endDate"': data.startEndDate.end,
        }
    })

    const sql = generateSql('worksheets', ['id', 'name', 'published', '"startDate"', '"endDate"'], newDocs)

    const sqlDays = generateSql('days', ['date', 'name', 'periods', '"worksheetId"'], allDays)

    console.log(newDocs.length, 'planilhas exportadas')
    return [sql, sqlDays]
}

async function generateMovements() {
    const db = admin.firestore()

    const collection = db.collection('movements')

    const movements = await collection.get()

    const newDocs = await map(movements.docs, async (doc) => {
        const data = doc.data()

        return {
            movement: data.movement,
            '"resultType"': data.resultType,
            '"countResults"': 0,
            fb_old_id: doc.id,
        }
    })

    console.log(newDocs.length, 'movimentos exportados')

    return generateSql('movements', ['movement', '"resultType"', '"countResults"', 'fb_old_id'], newDocs)
}

export async function generateSeed(filePath: string) {
    const sqlFile = path.resolve(__dirname, filePath)
    const [worksheetsSql, daysSql] = await generateWorksheets()
    const movementSql = await generateMovements()

    const fileContent = `${worksheetsSql}\n\n${daysSql}\n\n${movementSql}`

    await writeFileAsync(sqlFile, fileContent)
}

const stringifyRow = (fields: string[], row: Record<string, any>) =>
    fields.map((field) => {
        const value = row[field]
        if (value === undefined) return 'NULL'

        return typeof value === 'string' ? `'${value}'` : value
    })

function generateSql(table: string, fields: string[], data: Record<string, any>[]) {
    const header = `INSERT INTO ${table} (${fields.join(`,`)}) VALUES`

    const values = data.map((row) => `(${stringifyRow(fields, row)})`).join(',\n')

    return `${header}\n${values};`
}
