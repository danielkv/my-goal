import { supabase } from '@common/providers/supabase'

export async function toggleWorksheetPublishedUseCase(worksheetId: string, currentState: boolean): Promise<void> {
    const { error } = await supabase
        .from('worksheets')
        .update({ published: !currentState })
        .eq('id', worksheetId)
        .single()
    if (error) throw error
}
