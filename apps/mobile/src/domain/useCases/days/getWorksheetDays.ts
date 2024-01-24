import { Models } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getWorksheetDaysUseCase(worksheetId: string): Promise<Models<'days'>[]> {
    const { data, error } = await supabase
        .from('days')
        .select()
        .eq('worksheetId', worksheetId)
        .order('date', { ascending: true })

    if (error) throw error

    return data
}
