import { createSupabaseClient, createSupabaseSuperClient } from '../_shared/client.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTION') return new Response('ok', { headers: corsHeaders })

    const client = createSupabaseClient(req)
    const { error: userError, data: userData } = await client.auth.getUser()
    if (userError) return new Response(userError.message, { status: 500 })
    if (!userData.user.app_metadata.claims_admin) return new Response('Sem permissão para esta ação', { status: 403 })

    const { page = 0, pageSize = 10, sortBy = 'displayName', order = 'asc' } = await req.json()

    const superClient = createSupabaseSuperClient()

    const from = page * pageSize
    const to = from + pageSize

    const { error, data, count } = await superClient
        .from('users')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order(sortBy, { ascending: !(order?.toLowerString?.() === 'desc') })
    if (error) return new Response(error.message, { status: 500 })
    if (!count) return new Response('No users found', { status: 404 })

    const lastPage = Math.ceil(count / pageSize)
    const nextPage = page + 1 > lastPage ? null : page + 1
    const response = {
        items: data,
        lastPage,
        nextPage,
        total: count,
    }

    return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } })
})
