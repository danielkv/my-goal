import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
    if (req.method !== 'POST') return new Response('INVALID METHOD', { status: 404, headers: corsHeaders })

    try {
        const RECAPTCHA_SECRET = Deno.env.get('RECAPTCHA_SECRET')
        if (!RECAPTCHA_SECRET) new Response('No RECAPTCHA_SECRET found', { status: 400, headers: corsHeaders })

        const { token } = await req.json()
        if (!token) new Response('Missing data', { status: 400, headers: corsHeaders })

        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            body: JSON.stringify({
                secret: RECAPTCHA_SECRET,
                response: token,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })

        const { data } = await response.json()

        return new Response(data, { headers: corsHeaders })
    } catch (err) {
        return new Response(err, { status: 500, headers: corsHeaders })
    }
})
