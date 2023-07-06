const nodepath = require('node:path')
const { program } = require('commander')
const firebaseInit = require('./src/helpers/fbInit')
const exportData = require('./src/helpers/export')
const importData = require('./src/helpers/import')
const createUsers = require('./src/helpers/createUsers')

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
    .option('-c, --count <number>', 'Fake users count', 10)
    .description('Create admin user and fake users')
    .action((_, command) => {
        const { admin, count } = command.optsWithGlobals()

        firebaseInit()

        const filePath = nodepath.resolve(__dirname, admin)
        return createUsers(count, filePath)
    })

program.parse()
