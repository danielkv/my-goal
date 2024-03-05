import { z } from 'zod'

export const userProgramFormSchema = z.object({
    program_id: z.string({ required_error: 'Programa é obrigatório' }),
    paid_amount: z.number({ required_error: 'Valor é obrigatório', invalid_type_error: 'Valor inválido' }),
    method: z.enum(['none', 'stripe', 'pix', 'money'], {
        required_error: 'Método de pagamento é obrigatório',
        invalid_type_error: 'Valor inválido',
    }),
})

export type TUserProgramForm = z.infer<typeof userProgramFormSchema>

export const paymentMethodsMap = {
    none: 'Nenhum',
    stripe: 'Stripe',
    pix: 'Pix',
    money: 'Dinheiro',
}
