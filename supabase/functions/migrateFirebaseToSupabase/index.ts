import { createSupabaseClient } from '../_shared/client.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
    if (req.method !== 'POST') return new Response('Invalid method', { status: 405, headers: corsHeaders })

    const supabase = createSupabaseClient(req)

    const { fbuid, supabaseUserId } = await req.json()
    if (!fbuid) new Response('fbid not set', { status: 401, headers: corsHeaders })

    const { data, error } = await supabase.from('firebase_users').select('*').eq('uid', fbuid).single()
    if (error) new Response(error.message, { status: 500, headers: corsHeaders })
    // const { data, error } = await supabase.from('movement_results').select('*').eq('attrs.fields.uid.stringValue', fbuid).single()
    console.log(userData)

    await supabase.from('profiles').insert({
        id: userData.user?.id,
        displayName: data.attrs.displayName,
        email: data.email,
        photoUrl: data.attrs.photoUrl || null,
        phone: data.attrs.phoneNumber || null,
    })

    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/migrateFirebaseToSupabase' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
