import { IPaginatedResponse, IPagination, IUserProgram } from 'goal-models'
import { buildPaginatedResponse, getPagination } from 'goal-utils'

import { supabase } from '@common/providers/supabase'

interface IGetProgramListFilter extends IPagination {}

export async function getProgramListUseCase(filter: IGetProgramListFilter): Promise<IPaginatedResponse<IUserProgram>> {
    const { from, to } = getPagination(filter)

    const { error, data, count } = await supabase
        .from('programs')
        .select('*, user_programs(*)', { count: 'exact' })
        .range(from, to)
        .order('name')

    if (error) throw error
    if (count === null) throw new Error('Erro ao buscar o total de items')

    return buildPaginatedResponse(data, count, filter)
}
