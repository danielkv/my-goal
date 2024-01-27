import { supabase } from '@common/providers/supabase'

export async function removeMovementUseCase(movementId: string): Promise<void> {
    const { error } = await supabase.from('movements').delete().eq('id', movementId)
    if (error) throw error
}
