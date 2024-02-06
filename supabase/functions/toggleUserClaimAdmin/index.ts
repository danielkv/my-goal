import { createSupabaseSuperClient } from '../_shared/client.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { isAdmin } from '../_shared/isAdmin.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
    if (req.method !== 'POST') return new Response('INVALID METHOD', { status: 404, headers: corsHeaders })

    try {
        if (!(await isAdmin(req.headers.get('Authorization')!)))
            return new Response('Sem permissão para esta ação', { status: 403, headers: corsHeaders })

        const { action, userId } = await req.json()
        if (!action || !userId) return new Response('Dados insuficientes', { status: 400 })
        if (!['promote', 'demote'].includes(action))
            return new Response('Ação inválida', { status: 400, headers: corsHeaders })

        const superClient = createSupabaseSuperClient()

        const { error: error } = await superClient.rpc('set_claim', {
            uid: userId,
            claim: 'claims_admin',
            value: action === 'promote',
        })
        if (error) return new Response(error.message, { status: 500, headers: corsHeaders })

        return new Response('ok', { headers: corsHeaders })
    } catch (err) {
        return new Response(err, { status: 500, headers: corsHeaders })
    }
})
