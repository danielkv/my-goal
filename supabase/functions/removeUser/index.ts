import { createSupabaseClient } from '../_shared/client.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTION') return new Response('ok', { headers: corsHeaders })
    const supabase = createSupabaseClient(req)

    const { userId } = await req.json()
    if (!userId) return new Response('Missing user ID param', { status: 400 })

    const { error } = await supabase.auth.admin.deleteUser(userId, true)
    if (error) return new Response(error.message, { status: 500 })

    return new Response('ok', { headers: { 'Content-Type': 'application/json' } })
})
