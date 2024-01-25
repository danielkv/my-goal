import admin from 'firebase-admin'
import fs from 'fs'
import { randomUUID } from 'node:crypto'
import { promisify } from 'node:util'
import path from 'path'
import { map } from 'radash'

const writeFileAsync = promisify(fs.writeFile)

async function generateWorksheets() {
    const db = admin.firestore()

    const collection = db.collection('worksheets_v2')

    const worksheets = await collection.get()

    const allDays: Record<string, any>[] = []

    const newDocs: Record<string, any>[] = []

    await map(worksheets.docs, async (doc, index) => {
        const worksheetId = randomUUID()
        const days = await collection.doc(doc.id).collection('days').get()

        const mappedDays = days.docs.map((day) => {
            const data = day.data()
            return { '"worksheetId"': worksheetId, ...data, periods: JSON.stringify(data.periods) }
        })

        const data = doc.data()

        if (data.startEndDate !== undefined) {
            allDays.push(...mappedDays)
            newDocs.push({
                id: worksheetId,
                name: data.name,
                published: data.published,
                '"startDate"': data.startEndDate.start,
                '"endDate"': data.startEndDate.end,
            })
        }
    })

    const sql = generateSql('worksheets', ['id', 'name', 'published', '"startDate"', '"endDate"'], newDocs)

    const sqlDays = generateSql('days', ['date', 'name', 'periods', '"worksheetId"'], allDays)

    console.log(newDocs.length, 'planilhas exportadas')
    console.log(allDays.length, 'dias exportados')
    return [sql, sqlDays]
}

async function generateMovements() {
    const db = admin.firestore()

    const collection = db.collection('movements')
    const resultsColelction = db.collection('movement_results')

    const movements = await collection.get()

    const resultsDocs: Record<string, any>[] = []

    const newDocs = await map(movements.docs, async (doc, index) => {
        const newMovementId = randomUUID()
        const data = doc.data()
        const results = await resultsColelction.where('movementId', '==', doc.id).get()

        if (results.size > 0) {
            const mappedResults = results.docs.map((res) => {
                const data = res.data()
                return {
                    created_at: data.createdAt,
                    '"userId"': null,
                    date: data.date,
                    '"isPrivate"': data.isPrivate,
                    '"movementId"': newMovementId,
                    '"resultType"': data.result.type,
                    '"resultValue"': data.result.value,
                    fb_old_user_id: data.uid,
                }
            })

            resultsDocs.push(...mappedResults)
        }

        return {
            id: newMovementId,
            movement: data.movement,
            '"resultType"': data.resultType,
            '"countResults"': results.size,
        }
    })

    console.log(newDocs.length, 'movimentos exportados')
    console.log(resultsDocs.length, 'resultados exportados')

    const sql = generateSql('movements', ['id', 'movement', '"resultType"', '"countResults"'], newDocs)
    const sqlResults = generateSql(
        'movement_results',
        [
            'created_at',
            '"userId"',
            'date',
            '"isPrivate"',
            '"movementId"',
            '"resultType"',
            '"resultValue"',
            'fb_old_user_id',
        ],
        resultsDocs
    )

    return [sql, sqlResults]
}

async function generateWorkouts() {
    const db = admin.firestore()

    const collection = db.collection('workout_results')

    const workouts = await collection.get()

    const newDocs = await map(workouts.docs, async (doc, index) => {
        const data = doc.data()

        return {
            created_at: data.createdAt,
            '"userId"': null,
            date: data.date,
            '"isPrivate"': data.isPrivate,
            workout: JSON.stringify(data.workout),
            '"workoutSignature"': data.workoutSignature,
            '"resultType"': data.result.type,
            '"resultValue"': data.result.value,
            fb_old_user_id: data.uid,
        }
    })

    console.log(newDocs.length, 'resutlados de workout exportados')

    const sql = generateSql(
        'workout_results',
        [
            'created_at',
            '"userId"',
            'date',
            '"isPrivate"',
            'workout',
            '"workoutSignature"',
            '"resultType"',
            '"resultValue"',
            'fb_old_user_id',
        ],
        newDocs
    )

    return [sql]
}

export async function generateFile(filePath: string, sqls: string[]) {
    const sqlFile = path.resolve(__dirname, filePath)
    const content = sqls.join('\n\n')

    await writeFileAsync(sqlFile, content)
}

export async function generateSeed(filePath: string) {
    const worksheetSql = await generateWorksheets()
    const movementSql = await generateMovements()
    const workoutSql = await generateWorkouts()

    await generateFile(filePath, [...worksheetSql, ...movementSql, ...workoutSql])
}

const stringifyRow = (fields: string[], row: Record<string, any>) =>
    fields.map((field) => {
        const value = row[field]
        if (value === undefined || value === null) return 'NULL'

        return typeof value === 'string' ? `'${value}'` : value
    })

function generateSql(table: string, fields: string[], data: Record<string, any>[]) {
    const header = `INSERT INTO ${table} (${fields.join(`,`)}) VALUES`

    const values = data.map((row) => `(${stringifyRow(fields, row)})`).join(',\n')

    return `${header}\n${values};`
}
