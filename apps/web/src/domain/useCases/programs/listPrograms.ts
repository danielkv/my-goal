import { IPaginatedResponse, IPagination, ISorting, Models } from 'goal-models'
import { buildPaginatedResponse, getPagination, getSorting } from 'goal-utils'

import { supabase } from '@common/providers/supabase'

export interface ListProgramsFilter extends IPagination, ISorting<Models<'programs'>> {
    search?: string
}

export async function listProgramsUseCase(filter: ListProgramsFilter): Promise<IPaginatedResponse<Models<'programs'>>> {
    const query = supabase.from('programs').select('*', { count: 'exact' })

    if (filter.search) query.ilike('name', `%${filter.search}%`)

    const { from, to } = getPagination(filter)
    const { order, sortBy } = getSorting(filter)

    const { error, data, count } = await query.order(sortBy, { ascending: order === 'asc' }).range(from, to)
    if (error) throw error
    if (count === null) throw Error('Count is null')

    return buildPaginatedResponse(data, count, filter)
}
