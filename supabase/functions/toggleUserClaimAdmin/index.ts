import { createSupabaseClient, createSupabaseSuperClient } from '../_shared/client.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTION') return new Response('ok', { headers: corsHeaders })

    const client = createSupabaseClient(req)
    const { error: userError, data: userData } = await client.auth.getUser()
    if (userError) return new Response(userError.message, { status: 500 })
    if (!userData.user.app_metadata.claims_admin) return new Response('Sem permissão para esta ação', { status: 403 })

    const { action, userId } = await req.json()
    if (!action || !userId) return new Response('Dados insuficientes', { status: 400 })
    if (!['promote', 'demote'].includes(action)) return new Response('Ação inválida', { status: 400 })

    const superClient = createSupabaseSuperClient()

    const { error: error } = await superClient.rpc('set_claim', {
        uid: userId,
        claim: 'claims_admin',
        value: action === 'promote',
    })
    if (error) return new Response(error.message, { status: 500 })

    return new Response('ok')
})
