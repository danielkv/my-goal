import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

export function createSupabaseClient(authorization: string) {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const client = createClient(supabaseUrl, serviceKey, {
        global: { headers: { Authorization: authorization! } },
    })

    return client
}

export function createSupabaseSuperClient() {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const client = createClient(supabaseUrl, serviceKey)

    return client
}
