import { IWorksheet } from 'goal-models'

import { supabase } from '@common/providers/supabase'
import { injectWorksheetDaysUseCase } from '@useCases/days/injectWorksheetDays'

export async function getWorksheetByIdUseCase(worksheetId: string): Promise<IWorksheet> {
    const { error, data } = await supabase.from('worksheets').select('*').eq('id', worksheetId).single()
    if (error) throw error

    const worksheet = await injectWorksheetDaysUseCase(data)

    return worksheet
}
