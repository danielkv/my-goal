import { IMovementInput } from 'goal-models'
import { z } from 'zod'

export type TMovementForm = IMovementInput

export const movementFormSchema = z.object({
    movement: z.string({ required_error: 'Nome é obrigatório' }).min(1, { message: 'Nome é obrigatório' }),
    resultType: z.string({ required_error: 'Resultado é obrigatório' }),
    video: z.string().optional(),
    text: z.string().optional(),
})

export function createEmptyMovement(o?: Partial<TMovementForm>): TMovementForm {
    return {
        movement: '',
        resultType: 'reps',
        countResults: 0,
        created_at: '',
        id: '',
        text: '',
        video: '',
        ...o,
    }
}
