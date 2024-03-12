import { RevenueCat } from './revenuecat'
import { User, createClient } from '@supabase/supabase-js'
import dayjs from 'dayjs'
import { config } from 'dotenv'
import admin from 'firebase-admin'
import fs from 'fs'
import { randomUUID } from 'node:crypto'
import { promisify } from 'node:util'
import path from 'path'
import { map, reduce, sort } from 'radash'

config({ path: path.resolve(__dirname, '..', '..', '..', '..', '.env') })

const writeFileAsync = promisify(fs.writeFile)

async function generateStandardUserWorksheets(worksheetId: string) {
    const supabaseUrl = process.env.SUPABASE_URL ?? ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    const revenueCatApiKey = process.env.REVENUECAT_API_KEY ?? ''

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error, data } = await supabase.auth.admin.listUsers({ perPage: 100 })
    if (error) throw error

    const revenuecat = new RevenueCat(revenueCatApiKey)

    const userWorksheets = await reduce<User, Record<string, any>[]>(
        data.users,
        async (acc, user) => {
            const userEmail = user.email

            if (!userEmail) return acc

            const subscriber = await revenuecat.getSubscriber(userEmail)
            if (!subscriber.subscriber.entitlements) return acc

            const filteredEnt = Object.entries<Record<string, any>>(subscriber.subscriber.entitlements).filter(
                ([_, value]) => {
                    return dayjs().isBefore(value.expires_date)
                }
            )

            if (!filteredEnt.length) return acc

            const highestExpiration = sort(filteredEnt, ([_, v]) => dayjs(v.expires_date).unix(), true)[0][1]

            const entitlements = filteredEnt.map(([key]) => key)

            acc.push({
                user_id: user.id,
                paid_amount: entitlements.length === 4 ? 99.9 : 39.9,
                method: 'revenuecat',
                worksheet_id: worksheetId,
                entitlements,
                expires_at: highestExpiration.expires_date,
                created_at: highestExpiration.purchased_date || dayjs().toISOString(),
            })

            return acc
        },
        []
    )

    console.log(`${userWorksheets.length} planilhas de usuários exporados`)

    const sqlUserWorksheets = generateSql(
        'user_worksheets',
        ['created_at', 'expires_at', 'worksheet_id', 'user_id', 'paid_amount', 'method', 'entitlements'],
        userWorksheets
    )

    return sqlUserWorksheets
}

async function generateWorksheets() {
    const db = admin.firestore()

    const collection = db.collection('worksheets_v2')

    const worksheets = await collection.get()

    const allDays: Record<string, any>[] = []

    const newDocs: Record<string, any>[] = []

    const worksheetId = randomUUID()

    await map(worksheets.docs, async (doc, index) => {
        const worksheetWeekId = randomUUID()
        const days = await collection.doc(doc.id).collection('days').get()

        const mappedDays = days.docs.map((day) => {
            const data = day.data()
            return { '"worksheetId"': worksheetWeekId, ...data, periods: JSON.stringify(data.periods) }
        })

        const data = doc.data()

        if (data.startEndDate !== undefined) {
            allDays.push(...mappedDays)
            newDocs.push({
                id: worksheetWeekId,
                name: data.name,
                published: data.published,
                info: data.info,
                worksheet_id: worksheetId,
                '"startDate"': data.startEndDate.start,
                '"endDate"': data.startEndDate.end,
            })
        }
    })

    const sqlWorksheet = generateSql(
        'worksheets',
        ['id', 'name', 'published'],
        [
            {
                id: worksheetId,
                name: 'Planilha',
                published: true,
            },
        ]
    )

    const sqlWeeks = generateSql(
        'worksheet_weeks',
        ['id', 'name', 'published', 'info', '"startDate"', '"endDate"', 'worksheet_id'],
        newDocs
    )

    const sqlDays = generateSql('days', ['date', 'name', 'periods', '"worksheetId"'], allDays)

    const sqlUserWorksheets = await generateStandardUserWorksheets(worksheetId)

    console.log(newDocs.length, 'planilhas exportadas')
    console.log(allDays.length, 'dias exportados')
    return [sqlWorksheet, sqlWeeks, sqlDays, sqlUserWorksheets]
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

const stringifyRow = (fields: string[], row: Record<string, any>) =>
    fields.map((field) => {
        const value = row[field]
        if (value === undefined || value === null) return 'NULL'

        if (Array.isArray(value)) return `'{${value.join(',')}}'`

        return typeof value === 'string' ? `'${value}'` : value
    })

function generateSql(table: string, fields: string[], data: Record<string, any>[]) {
    const header = `INSERT INTO ${table} (${fields.join(`,`)}) VALUES`

    const values = data.map((row) => `(${stringifyRow(fields, row)})`).join(',\n')

    return `${header}\n${values};`
}

export async function generateSeed(filePath: string) {
    const worksheetSql = await generateWorksheets()
    const movementSql = await generateMovements()
    const workoutSql = await generateWorkouts()

    await generateFile(filePath, [...worksheetSql, ...movementSql, ...workoutSql])
}
