import { faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const supabase = createClient(supabaseUrl, supabaseKey)

export async function emulateCreateFbUser(fbuid: string) {
    await supabase.auth.signUp({
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number('+55 ## ##### ####'),
        options: {
            data: {
                fbuid,
                displayName: faker.person.fullName(),
                confirmation_sent_at: new Date().toISOString(),
            },
        },
    })
}
