import { Models } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getMovementByIdUseCase(movementId: string): Promise<Models<'movements'>> {
    const { data, error } = await supabase.from('movements').select('*').eq('id', movementId).single()
    if (error) throw error

    return data
}
