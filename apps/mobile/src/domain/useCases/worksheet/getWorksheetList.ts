import { Models } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getWorksheetListUseCase(): Promise<Models<'worksheets'>[]> {
    const { data, error } = await supabase
        .from('worksheets')
        .select()
        .eq('published', true)
        .order('startDate', { ascending: false })
    if (error) throw error

    return data
}
