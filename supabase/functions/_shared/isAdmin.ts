import { createSupabaseClient } from './client.ts'

export async function isAdmin(authorization: string) {
    const client = createSupabaseClient(authorization)

    const { error: userError, data: userData } = await client.auth.getUser()
    if (userError) return false

    return !!userData.user.app_metadata.claims_admin
}
