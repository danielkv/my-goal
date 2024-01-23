import { IWorksheetModel } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getWorksheetByIdUseCase(worksheetId: string): Promise<IWorksheetModel> {
    const { error, data: worksheetData } = await supabase.from('worksheets').select('*').eq('id', worksheetId).single()
    if (error) throw error

    if (!worksheetData.published) throw new Error('Planilha não encontrada')

    return worksheetData
}
