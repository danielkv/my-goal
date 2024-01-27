import { IWorksheet } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getWorksheetsUseCase(): Promise<Omit<IWorksheet, 'days'>[]> {
    const { error, data } = await supabase.from('worksheets').select('*').order('startDate', { ascending: false })
    if (error) throw error

    return data
}
