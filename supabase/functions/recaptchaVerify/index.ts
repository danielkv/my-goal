import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTION') return new Response('ok', { headers: corsHeaders })

    const RECAPTCHA_SECRET = Deno.env.get('RECAPTCHA_SECRET')
    if (!RECAPTCHA_SECRET) throw new Error('No RECAPTCHA_SECRET found')

    const { token } = await req.json()

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        body: JSON.stringify({
            secret: RECAPTCHA_SECRET,
            response: token,
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    const { data } = await response.json()

    return new Response(data)
})
