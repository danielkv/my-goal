import { IPaginatedResponse, IPagination, IWorksheet } from 'goal-models'
import { buildPaginatedResponse, getPagination } from 'goal-utils'

import { supabase } from '@common/providers/supabase'

export interface GetWorksheetWeeksUseCaseArgs extends IPagination {
    worksheetId: string
}

export async function getWorksheetWeeksUseCase(
    filter: GetWorksheetWeeksUseCaseArgs
): Promise<IPaginatedResponse<Omit<IWorksheet, 'days'>>> {
    const { from, to } = getPagination(filter)

    const { error, data, count } = await supabase
        .from('worksheet_weeks')
        .select('*', { count: 'exact' })
        .eq('worksheet_id', filter.worksheetId)
        .order('startDate', { ascending: false })
        .range(from, to)

    if (error) throw error
    if (count === null) throw new Error('Erro ao retornar dados')

    return buildPaginatedResponse(data, count, filter)
}
