import { createSupabaseClient } from '../_shared/client.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
    if (req.method !== 'POST') return new Response('INVALID METHOD', { status: 404, headers: corsHeaders })

    const client = createSupabaseClient(req)
    const { provider } = await req.json()

    const { error, data } = await client.auth.signInWithOAuth({
        provider,
    })
    if (error) throw error

    return Response.redirect(data.url, 303)
})
