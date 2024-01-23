import createUsers from './src/helpers/createUsers'
import firebaseInit from './src/helpers/fbInit'
import { generateSeed } from './src/helpers/generateSeed'
import { program } from 'commander'
import nodepath from 'node:path'

program.option('-c, --cert <char>')

program
    .command('create-seed <file>')
    .description('Create the seed file')
    .action((file, _, command) => {
        const { cert } = command.optsWithGlobals()
        if (!file) throw new Error('File option not defined')

        const certFilePath = cert && nodepath.resolve(__dirname, cert)
        firebaseInit(certFilePath)

        const filePath = nodepath.resolve(__dirname, '..', '..', file)
        return generateSeed(filePath)
    })

program
    .command('createUsers')
    .option('-a, --admin <file>', 'Admin data file path', 'admin-user.json')
    .option('-c, --count <number>', 'Fake users count', '10')
    .description('Create admin user and fake users')
    .action((_, command) => {
        const { admin, count, cert } = command.optsWithGlobals()

        const certFilePath = cert && nodepath.resolve(__dirname, cert)
        firebaseInit(certFilePath)

        const filePath = nodepath.resolve(__dirname, admin)
        return createUsers(Number(count), filePath)
    })

program.parse()
