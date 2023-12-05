import { z } from 'zod'

export type IContactForm = {
    subject: string
    name: string
    email: string
    phone: string
    message: string
}

export const initialContactForm: IContactForm = {
    name: '',
    email: '',
    message: '',
    phone: '',
    subject: '',
}

export const formSchema = z.object({
    subject: z.string({ required_error: 'Assunto é obrigatório' }).nonempty('Nome é obrigatório'),
    name: z.string({ required_error: 'Nome é obrigatório' }).nonempty('Nome é obrigatório'),
    email: z
        .string({ required_error: 'Email é obrigatório' })
        .email({ message: 'Email inválido' })
        .nonempty('Nome é obrigatório'),
    phone: z.string().optional(),
    message: z.string({ required_error: 'Mensagem é obrigatória' }).nonempty('Nome é obrigatório'),
})
