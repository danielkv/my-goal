import { createSupabaseClient } from './client.ts'

export async function isAdmin(req: Request) {
    const client = createSupabaseClient(req)

    const { error: userError, data: userData } = await client.auth.getUser()
    if (userError) return false

    return !!userData.user.app_metadata.claims_admin
}
