import { supabase } from '@common/providers/supabase'

export async function getWorksheetsUseCase() {
    const { error, data } = await supabase.from('worksheets').select('*').order('created_at', { ascending: false })
    if (error) throw error

    return data
}
