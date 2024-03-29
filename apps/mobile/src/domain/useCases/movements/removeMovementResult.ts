import { supabase } from '@common/providers/supabase'

export async function removeMovementResultUseCase(movementResultId: string): Promise<void> {
    const { error } = await supabase.from('movement_results').delete().eq('id', movementResultId)
    if (error) throw error
}
