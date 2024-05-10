import { supabase } from '@common/providers/supabase'

export type ToggleWeekPublishedUseCaseAction = 'publish' | 'unpublish'

export async function toggleWeekPublishedUseCase(
    weekId: string,
    action: ToggleWeekPublishedUseCaseAction
): Promise<void> {
    const { error } = await supabase
        .from('worksheet_weeks')
        .update({ published: action === 'publish' })
        .eq('id', weekId)
        .single()
    if (error) throw error
}
