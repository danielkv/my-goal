import { createSupabaseClient, createSupabaseSuperClient } from '../_shared/client.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTION') return new Response('ok', { headers: corsHeaders })
    const supabase = createSupabaseClient(req.headers.get('Authorization')!)

    const { data, error: userError } = await supabase.auth.getUser()
    if (userError) return new Response(userError.message, { status: 500 })

    const { userId } = await req.json()
    if (!userId) return new Response('Missing user ID param', { status: 400 })

    if (data.user.id !== userId) return new Response('Only the user itself can delete its account', { status: 403 })

    const superUserClient = createSupabaseSuperClient()
    const { error } = await superUserClient.auth.admin.deleteUser(userId)
    if (error) return new Response(error.message, { status: 500 })

    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
})
