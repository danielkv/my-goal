import { IWorksheet } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getWorksheetByIdUseCase(worksheetId: string): Promise<IWorksheet> {
    const { error, data } = await supabase
        .from('worksheets')
        .select('*, days(*)')
        .eq('id', worksheetId)
        .order('date', { referencedTable: 'days' })
        .single()

    if (error) throw error

    return data
}
