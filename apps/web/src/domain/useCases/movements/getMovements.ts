import { IMovement } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getMovementsUseCase(): Promise<IMovement[]> {
    const { error, data } = await supabase.from('movements').select('*').order('movement')
    if (error) throw error

    return data
}
