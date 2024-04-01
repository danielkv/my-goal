import { supabase } from '@common/providers/supabase'

export async function removeWorksheetUseCase(worksheetId: string): Promise<void> {
    const { error } = await supabase.from('worksheet_weeks').delete().eq('id', worksheetId)
    if (error) throw error
}
