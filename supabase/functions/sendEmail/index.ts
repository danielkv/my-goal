import { corsHeaders } from '../_shared/cors.ts'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTION') return new Response('ok', { headers: corsHeaders })

    const client = new SMTPClient({
        connection: {
            hostname: Deno.env.get('MAIL_HOSTNAME') ?? '',
            port: Number(Deno.env.get('MAIL_PORT')) || 465,
            tls: true,
            auth: {
                username: Deno.env.get('MAIL_USERNAME') ?? '',
                password: Deno.env.get('MAIL_PASSWORD') ?? '',
            },
        },
    })

    const { email, name, subject, to, phone, message } = await req.json()

    await client.send({
        from: Deno.env.get('MAIL_FROM') ?? '',
        replyTo: email,
        subject: subject,
        to: to,
        content: `Nome: ${name}\nEmail: ${email}\nTelefone: ${phone}\n\n${message}`,
    })

    await client.close()

    return new Response('ok')
})
