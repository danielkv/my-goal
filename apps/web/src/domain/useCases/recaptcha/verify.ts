import { firebaseProvider } from '@common/providers/firebase'

interface IVerifyResponse {
    success: boolean
    challenge_ts: string
    hostname: string
    score: number
    action: string
}

const recaptchaVerify = firebaseProvider.FUNCTION_CALL<string, IVerifyResponse>('recaptchaVerify')

export async function recaptchaVerifyUseCase(token: string) {
    const res = await recaptchaVerify(token)

    return res.data
}
