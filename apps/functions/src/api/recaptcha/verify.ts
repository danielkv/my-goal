import { init } from '../../helpers'
import axios from 'axios'
import { remoteConfig } from 'firebase-admin'
import { ExplicitParameterValue } from 'firebase-admin/lib/remote-config/remote-config-api'
import { https } from 'firebase-functions'

init()

export const recaptchaVerify = https.onCall(async (token) => {
    const template = await remoteConfig().getTemplate()
    const RECAPTCHA_SECRET = template.parameters.RECAPTCHA_SECRET.defaultValue as ExplicitParameterValue | undefined

    if (!RECAPTCHA_SECRET?.value) throw new Error('No RECAPTCHA_SECRET found')

    const response = await axios.post(
        '/recaptcha/api/siteverify',
        { secret: RECAPTCHA_SECRET.value, response: token },
        { baseURL: 'https://www.google.com', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    return response.data
})
