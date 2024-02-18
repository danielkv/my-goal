import { supabase } from '@common/providers/supabase'

interface IVerifyResponse {
    success: boolean
    challenge_ts: string
    hostname: string
    score: number
    action: string
}

export async function recaptchaVerifyUseCase(token: string): Promise<IVerifyResponse> {
    const { error, data } = await supabase.functions.invoke<IVerifyResponse>('recaptchaVerify', {
        method: 'POST',
        body: { token },
    })
    if (error) throw error
    if (!data) throw new Error('Could not verify token')

    return data
}
