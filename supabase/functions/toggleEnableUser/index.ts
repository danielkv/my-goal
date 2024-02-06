import { createSupabaseSuperClient } from '../_shared/client.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { isAdmin } from '../_shared/isAdmin.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
    if (req.method !== 'POST') return new Response('INVALID METHOD', { status: 404, headers: corsHeaders })

    try {
        if (!(await isAdmin(req.headers.get('Authorization')!)))
            return new Response('Sem permissão para esta ação', { status: 403, headers: corsHeaders })

        const { userId, action } = await req.json()
        if (!userId) return new Response('Missing user ID param', { status: 400, headers: corsHeaders })
        if (!['enable', 'disable'].includes(action))
            return new Response('Inalid action', { status: 400, headers: corsHeaders })

        const superClient = createSupabaseSuperClient()

        const duration = action === 'enable' ? 'none' : `${100 * 365 * 24}h` // 100 years
        const { error } = await superClient.auth.admin.updateUserById(userId, { ban_duration: duration })
        if (error) return new Response(error.message, { status: 500, headers: corsHeaders })

        return new Response('ok', { headers: corsHeaders })
    } catch (err) {
        return new Response(err, { status: 500, headers: corsHeaders })
    }
})
