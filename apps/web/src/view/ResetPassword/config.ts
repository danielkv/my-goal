import { z } from 'zod'

export type TResetPasswordForm = {
    password: string
    repeatPassword: string
}

export const passwordRecoveryFormInitialValues: TResetPasswordForm = { password: '', repeatPassword: '' }

export const loginFormSchema = z
    .object({
        password: z.string(),
        repeatPassword: z.string(),
    })
    .refine(({ password, repeatPassword }) => password === repeatPassword, {
        message: 'Senhas não são iguais',
        path: ['repeatPassword'],
    })
