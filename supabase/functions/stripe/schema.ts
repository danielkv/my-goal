import z from 'https://deno.land/x/zod@v3.22.4/index.ts'

export const deleteProgramProductSchema = z.object({
    productId: z.string({ required_error: '' }),
    paymentLinkId: z.string({ required_error: '' }),
})

export type DeleteProgramProductSchema = z.infer<typeof deleteProgramProductSchema>

export const createProgramProductSchema = z.object({
    name: z.string({ required_error: 'Nome é obrigatório' }),
    price: z.number({ required_error: 'Valor é obrigatório' }),
    programId: z.string().optional(),
})

export type CreateProgramProductSchema = z.infer<typeof createProgramProductSchema>

export const updateProgramProductSchema = z.object({
    price: z.number({ required_error: 'Valor é obrigatório' }),
    product_id: z.string({ required_error: 'ID do produto obrigatório' }),
})

export type UpdateProgramProductSchema = z.infer<typeof updateProgramProductSchema>
