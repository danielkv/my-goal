import { IPaginatedResponse, IPagination, Models } from 'goal-models'
import { buildPaginatedResponse, getPagination } from 'goal-utils'

import { supabase } from '@common/providers/supabase'

type TGetSegmentsByProgramIdResponse = IPaginatedResponse<
    Models<'program_segments'> & {
        sessions: Models<'program_sessions'>[]
    }
>

interface IGetSegmentsByProgramIdFilter extends IPagination {
    programId: string
}

export async function getSegmentsByProgramIdUseCase(
    filter: IGetSegmentsByProgramIdFilter
): Promise<TGetSegmentsByProgramIdResponse> {
    const { from, to } = getPagination(filter)

    const { error, data, count } = await supabase
        .from('program_segments')
        .select('*, sessions:program_sessions(*)', { count: 'exact' })
        .eq('program_id', filter.programId)
        .order('order')
        .order('order', { referencedTable: 'program_sessions' })
        .range(from, to)

    if (error) throw error
    if (count === null) throw new Error('Erro ao buscar o total de items')

    return buildPaginatedResponse(data, count, filter)
}
