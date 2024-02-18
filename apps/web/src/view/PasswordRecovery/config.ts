import { z } from 'zod'

export type TPasswordRecoveryForm = {
    email: string
}

export const passwordRecoveryFormInitialValues: TPasswordRecoveryForm = { email: '' }

export const loginFormSchema = z.object({
    email: z.string().email(),
})
