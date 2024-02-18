import { IMovementInput } from 'goal-models'
import { pick } from 'radash'

import { supabase } from '@common/providers/supabase'

export async function updateMovementUseCase(movementId: string, movement: IMovementInput): Promise<void> {
    const { error } = await supabase
        .from('movements')
        .update(pick(movement, ['movement', 'resultType']))
        .eq('id', movementId)

    if (error) throw error
}
