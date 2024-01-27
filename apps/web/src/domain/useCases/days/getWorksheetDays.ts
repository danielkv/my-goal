import { IDayModel } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getWorksheetDaysUseCase(worksheetId: string): Promise<IDayModel[]> {
    const { error, data } = await supabase.from('days').select('*').eq('worksheetId', worksheetId).order('date')
    if (error) throw error

    return data
}
