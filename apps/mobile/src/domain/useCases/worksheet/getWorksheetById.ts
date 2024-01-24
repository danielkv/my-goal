import { IWorksheet } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getWorksheetByIdUseCase(worksheetId: string): Promise<IWorksheet> {
    const { error, data: worksheetData } = await supabase
        .from('worksheets')
        .select('*, days(*)')
        .eq('id', worksheetId)
        .single()

    if (error) throw error

    if (!worksheetData.published) throw new Error('Planilha não encontrada')

    return worksheetData
}
