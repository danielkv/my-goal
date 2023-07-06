import { IMigrationFile } from '../types/migration'
import dayjs from 'dayjs'
import * as admin from 'firebase-admin'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import { map } from 'radash'

const readDirAsync = promisify(fs.readdir)

async function checkAndRunMigration(migrationFilePath: string, migrationVersion: string) {
    const db = admin.firestore()

    const collectionRef = db.collection('migrations')

    const { migrate } = (await import(migrationFilePath)) as IMigrationFile

    await migrate(db)

    await collectionRef.add({
        version: migrationVersion,
        fileName: path.basename(migrationFilePath),
        dateTime: dayjs().toISOString(),
    })
}

async function checkAndRollbackMigration(migrationId: string, migrationFilePath: string) {
    const db = admin.firestore()

    const collectionRef = db.collection('migrations')

    const { rollback } = (await import(migrationFilePath)) as IMigrationFile

    await rollback(db)

    await collectionRef.doc(migrationId).delete()
}

export async function runMigrations(dir: string) {
    const db = admin.firestore()
    const collectionRef = db.collection('migrations')
    const migrationsSnapshot = await collectionRef.get()

    const migrations = await readDirAsync(dir)

    const versions = migrations.map((file) => {
        const version = file.split('.')[0].split('-')[1]
        return {
            fileName: file,
            version,
        }
    })

    const executedVersions: string[] = migrationsSnapshot.docs.map((m) => m.data().version)

    const versionsToRun = versions.reduce<Record<string, string>[]>((acc, version) => {
        if (!executedVersions.includes(version.version)) acc.push(version)
        return acc
    }, [])

    await map(versionsToRun, ({ fileName, version }) => {
        const filePath = path.resolve(dir, fileName)
        return checkAndRunMigration(filePath, version)
    })
}

export async function rollbackLastMigration(dir: string) {
    const db = admin.firestore()
    const collectionRef = db.collection('migrations')

    const migrationsSnapshot = await collectionRef.orderBy('dateTime', 'desc').get()
    if (migrationsSnapshot.empty) throw new Error('No migration were executed')

    const lastMigration = migrationsSnapshot.docs[0]
    const migrationData = lastMigration.data()

    const filePath = path.resolve(dir, migrationData.fileName)

    return checkAndRollbackMigration(lastMigration.id, filePath)
}

export async function createMigration(directory: string, description: string) {
    const newVersion = crypto.randomBytes(6).toString('hex')
    const dateTime = Date.now()

    const filePath = path.resolve(directory, `${dateTime}-${newVersion}.ts`)
    if (fs.existsSync(filePath)) throw new Error(`File ${filePath} already exists`)

    const fileContent = `// Description: ${description}
// Migration version: ${newVersion}
// Created at: ${dayjs(dateTime).format('DD//MM/YYYY HH:mm:ss')}
//
import * as admin from 'firebase-admin'

export async function migrate(db: admin.firestore.Firestore) {}
		
export async function rollback(db: admin.firestore.Firestore) {}`

    return fs.writeFileSync(filePath, fileContent)
}
