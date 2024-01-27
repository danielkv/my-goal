import { z } from 'zod'

export type TLoginForm = {
    email: string
    password: string
}

export const loginFormInitialValues: TLoginForm = { email: '', password: '' }

export const loginFormSchema = z.object({
    login: z.string().email(),
    password: z.string(),
})
