import createUsers from './src/helpers/createUsers'
import exportData from './src/helpers/export'
import firebaseInit from './src/helpers/fbInit'
import importData from './src/helpers/import'
import { createMigration, rollbackLastMigration, runMigrations } from './src/helpers/migration'
import { program } from 'commander'
import nodepath from 'node:path'

program.option('-c, --cert <char>')

program
    .command('export')
    .description('export data to JSON file')
    .option('-f, --file <file>', 'File path', 'data.json')
    .option('-p, --path <char>', 'Collection name to export')
    .action((_, command) => {
        const { cert, file, path } = command.optsWithGlobals()
        if (!file) throw new Error('File option not defined')

        const certFilePath = cert && nodepath.resolve(__dirname, cert)
        firebaseInit(certFilePath)

        const filePath = nodepath.resolve(__dirname, file)
        return exportData(filePath, path)
    })

program
    .command('import')
    .description('import data from JSON file')
    .option('-f, --file <file>', 'File path', 'data.json')
    .option('-p, --path <char>', 'Collection name to export')
    .action((_, command) => {
        const { cert, file, path } = command.optsWithGlobals()
        if (!file) throw new Error('File option not defined')

        const certFilePath = cert && nodepath.resolve(__dirname, '..', cert)
        firebaseInit(certFilePath)

        const filePath = nodepath.resolve(__dirname, file)
        return importData(filePath, path)
    })

program
    .command('createUsers')
    .option('-a, --admin <file>', 'Admin data file path', 'admin-user.json')
    .option('-c, --count <number>', 'Fake users count', '10')
    .description('Create admin user and fake users')
    .action((_, command) => {
        const { admin, count } = command.optsWithGlobals()

        firebaseInit()

        const filePath = nodepath.resolve(__dirname, admin)
        return createUsers(Number(count), filePath)
    })

program
    .command('migrate <mode>')
    .description('Run migration')
    .option('-d, --directory <folder>', 'Force running or rollback', 'migrations')
    .action((mode, _, command) => {
        const { directory } = command.optsWithGlobals()

        if (!['run', 'rollback'].includes(mode)) throw new Error(`Migrate mode ${mode} is not valid`)

        firebaseInit()

        const dirPath = nodepath.resolve(__dirname, directory)
        if (mode === 'run') return runMigrations(dirPath)
        else return rollbackLastMigration(dirPath)
    })

program
    .command('createMigration <description>')
    .description('Create new migration')
    .option('-d, --directory <folder>', 'Force running or rollback', 'migrations')
    .action(async (description, _, command) => {
        const { directory } = command.optsWithGlobals()

        const dirPath = nodepath.resolve(__dirname, directory)
        return createMigration(dirPath, description)
    })

program.parse()
