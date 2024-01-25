import { IUserHighestResult } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getMovementHighestScoreUseCase(
    movementId: string,
    userId: string
): Promise<IUserHighestResult | null> {
    const { data, error } = await supabase
        .from('highest_movement_results')
        .select('*')
        .eq('movementId', movementId)
        .eq('userId', userId)
        .single()
    if (error) throw error

    return data
}
