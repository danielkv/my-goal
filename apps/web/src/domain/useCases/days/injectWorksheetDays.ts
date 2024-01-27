import { IWorksheet, Models } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function injectWorksheetDaysUseCase(worksheet: Models<'worksheets'>): Promise<IWorksheet> {
    const { error, data } = await supabase.from('days').select('*').eq('worksheetId', worksheet.id).order('date')
    if (error) throw error

    return { ...worksheet, days: data }
}
