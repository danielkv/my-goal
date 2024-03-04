import { IMovementInput } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function saveMovementUseCase(movementInput: IMovementInput) {
    if (!movementInput.id) {
        delete movementInput.id
        movementInput.countResults = 0
    }

    const { error } = await supabase
        .from('movements')
        .upsert(movementInput, { onConflict: 'id', ignoreDuplicates: false })
    if (error) throw error
}
