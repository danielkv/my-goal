import { init } from '../../helpers'
import { remoteConfig } from 'firebase-admin'
import { ExplicitParameterValue } from 'firebase-admin/lib/remote-config/remote-config-api'
import { https } from 'firebase-functions'
import { createTransport } from 'nodemailer'

init()

export const sendEmail = https.onCall(async (data) => {
    const template = await remoteConfig().getTemplate()
    const DEFAULT_MAIL_CONFIG = template.parameters.DEFAULT_MAIL_CONFIG.defaultValue as
        | ExplicitParameterValue
        | undefined

    if (!DEFAULT_MAIL_CONFIG?.value) throw new Error('No DEFAULT_MAIL_CONFIG found')

    const config = JSON.parse(DEFAULT_MAIL_CONFIG.value)

    const transporter = createTransport({
        host: config.host,
        port: config.port,
        auth: config.auth,
    })

    await transporter.sendMail({
        from: config.from,
        replyTo: data.email,
        subject: data.subject,
        to: config.to,
        text: `Nome: ${data.name}\nEmail: ${data.email}\nTelefone: ${data.phone}\n\n${data.message}`,
    })

    return 'ok'
})
