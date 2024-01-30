import { createSupabaseSuperClient } from '../_shared/client.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { isAdmin } from '../_shared/isAdmin.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
    if (req.method !== 'POST') return new Response('INVALID METHOD', { status: 404, headers: corsHeaders })

    try {
        if (!(await isAdmin(req)))
            return new Response('Sem permissão para esta ação', { status: 403, headers: corsHeaders })

        const { page = 0, pageSize = 10, sortBy = 'displayName', order = 'asc' } = await req.json()

        const superClient = createSupabaseSuperClient()

        const from = page * pageSize
        const to = from + pageSize

        const { error, data, count } = await superClient
            .from('users')
            .select('*', { count: 'exact' })
            .range(from, to - 1)
            .order(sortBy, { ascending: !(order?.toLowerString?.() === 'desc') })
        if (error) return new Response(error.message, { status: 500, headers: corsHeaders })
        if (!count) return new Response('No users found', { status: 404, headers: corsHeaders })

        const lastPage = Math.ceil(count / pageSize)
        const nextPage = page + 1 >= lastPage ? null : page + 1
        const response = {
            items: data,
            lastPage,
            nextPage,
            total: count,
        }

        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    } catch (err) {
        return new Response(err, { status: 500, headers: corsHeaders })
    }
})
