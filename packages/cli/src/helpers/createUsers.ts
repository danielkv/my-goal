import { faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

config({ path: path.resolve(__dirname, '..', '..', '..', '..', '.env') })

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function createUsers(countFakeUsers?: number, adminFilePath?: string) {
    if (Number.isNaN(countFakeUsers)) throw new Error('count is nor a number')

    if (adminFilePath && fs.existsSync(adminFilePath)) {
        const adminData = JSON.parse(fs.readFileSync(adminFilePath, { encoding: 'utf-8' }))

        if (!adminData.displayName || !adminData.email || !adminData.password)
            throw new Error('Admin user needs these fields: displatName, email, password')

        const { data, error } = await supabase.auth.admin.createUser({
            email: adminData.email,
            password: adminData.password,
            email_confirm: adminData.email_confirm,
            user_metadata: {
                displayName: adminData.displayName,
            },
        })

        if (error) throw error

        await supabase.rpc('set_claim', {
            uid: data.user.id,
            claim: 'claims_admin',
            value: true,
        })
    } else {
        console.log('Admin user will not be created')
    }

    const fakerUserPromises = Array.from({ length: countFakeUsers || 8 }).map(() => {
        return supabase.auth.admin.createUser({
            email: faker.internet.email(),
            password: faker.internet.password(),
            email_confirm: faker.datatype.boolean(),
            user_metadata: {
                displayName: faker.person.fullName(),
            },
        })
    })

    await Promise.all(fakerUserPromises)
}
