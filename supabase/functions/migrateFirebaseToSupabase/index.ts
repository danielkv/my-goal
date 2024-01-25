import { createSupabaseClient } from '../_shared/client.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
    if (req.method !== 'POST') return new Response('Invalid method', { status: 405, headers: corsHeaders })

    const { type, record } = await req.json()
    if (type !== 'INSERT') return new Response('Invalid event type', { status: 405, headers: corsHeaders })

    const fbuid = record.raw_user_meta_data.fbuid
    if (!fbuid) return new Response('fbuid not found', { status: 200, headers: corsHeaders })

    const supabase = createSupabaseClient(req)

    try {
        console.log(
            await supabase.from('movement_results').select('*').eq('fb_old_user_id', 'DoTZCINLbCNle30sTa5kcnVIoY83')
        )

        const { count, error } = await supabase
            .from('movement_results')
            .update({ userId: record.id, fb_old_user_id: null }, { count: 'exact' })
            .eq('fb_old_user_id', fbuid)
        if (error) throw error

        return new Response(JSON.stringify({ userId: record.id, fbuid, movements: count }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    } catch (err) {
        return new Response(err.message, { status: 500, headers: corsHeaders })
    }
})
