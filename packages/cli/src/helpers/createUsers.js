const admin = require('firebase-admin')
const { pick } = require('radash')
const fs = require('node:fs')
const { faker } = require('@faker-js/faker')

module.exports = async function createUsers(countFakeUsers, adminFilePath) {
    const auth = admin.auth()

    if (fs.existsSync(adminFilePath)) {
        const adminData = JSON.parse(fs.readFileSync(adminFilePath, { encoding: 'utf-8' }))

        if (!adminData.displayName || !adminData.email || !adminData.password)
            throw new Error('Admin user needs these fields: displatName, email, password')

        const userCreated = await auth.getUserByEmail(adminData.email).catch(() => null)

        if (!userCreated) {
            const user = await auth.createUser(pick(adminData, ['displayName', 'email', 'password', 'emailVerified']))

            auth.setCustomUserClaims(user.uid, { admin: true })
        } else console.log('Admin user already exists, skipping...')
    } else {
        console.log('Admin user will not be created')
    }

    const fakerUserPromises = Array.from({ length: countFakeUsers || 8 }).map(() => {
        return auth.createUser({
            displayName: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            emailVerified: faker.datatype.boolean(),
        })
    })

    await Promise.all(fakerUserPromises)
}
