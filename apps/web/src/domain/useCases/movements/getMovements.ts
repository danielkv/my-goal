import { IMovement, IPaginatedResponse, IPagination, ISorting } from 'goal-models'
import { buildPaginatedResponse, getPagination, getSorting } from 'goal-utils'

import { supabase } from '@common/providers/supabase'

export interface IGetMovements extends IPagination, ISorting<IMovement> {
    search?: string
}

export async function getMovementsUseCase(args: IGetMovements): Promise<IPaginatedResponse<IMovement>> {
    const { from, to } = getPagination(args)
    const { sortBy, order } = getSorting(args, 'movement')

    let query = supabase
        .from('movements')
        .select('*', { count: 'exact' })
        .order(sortBy, { ascending: order === 'asc' })
        .range(from, to)

    if (args.search && args.search.length >= 3) query = query.ilike('movement', `%${args.search}%`)

    const { error, data, count: total } = await query

    if (error) throw error
    if (total === null) throw new Error('Erro na contagem dos dados')

    return buildPaginatedResponse(data, total, args)
}
