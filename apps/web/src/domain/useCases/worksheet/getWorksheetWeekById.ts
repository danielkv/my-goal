import { IWorksheet } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getWorksheetWeekByIdUseCase(weekId: string): Promise<IWorksheet | IWorksheet<'v2'>> {
    const { error, data } = await supabase
        .from('worksheet_weeks')
        .select('*, days(*)')
        .eq('id', weekId)
        .order('date', { referencedTable: 'days' })
        .single()

    if (error) throw error

    return data
}
