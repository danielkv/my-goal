import z from 'https://deno.land/x/zod@v3.22.4/index.ts'

export const toggleUserClaimAdmin = z.object({
    action: z.enum(['promote', 'demote'], {
        required_error: 'Ação é obrigatório',
        invalid_type_error: 'Ação inválida',
    }),
    userId: z.string({ required_error: 'ID do usuário é obrigatório' }),
})

export type TToggleUserClaimAdminBody = z.infer<typeof toggleUserClaimAdmin>
