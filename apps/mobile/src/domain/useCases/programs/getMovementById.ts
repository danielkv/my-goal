import { IMovement } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getMovimentByIdUseCase(movimentId: string): Promise<IMovement> {
    const { error, data } = await supabase.from('movements').select('*').eq('id', movimentId).single()
    if (error) throw error

    return data
}
