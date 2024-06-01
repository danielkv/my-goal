import { ModelsInsert } from 'goal-models'
import * as z from 'zod'

export type ProgramInterrestForm = ModelsInsert<'program_interests'>

export const initialValues: ProgramInterrestForm = {
    email: '',
    name: '',
    phone: '',
    program_id: '',
}

export const programInterestSchema = z.object({
    email: z.string().min(1, 'Email é obrigatório').email('Formato de email inválido'),
    phone: z.string().min(1, 'Telefone é obrigatório'),
    name: z.string().min(1, 'Nome é obrigatório'),
})
