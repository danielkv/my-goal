import { IDayModel } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getWorksheetDayByIdFnUseCase(worksheetId: string, dayId: string): Promise<IDayModel> {
    const { data, error } = await supabase.from('days').select().eq('id', dayId).single()
    if (error) throw error

    return data
}
