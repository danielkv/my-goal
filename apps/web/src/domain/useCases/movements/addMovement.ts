import { IMovementInput } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function addMovementUseCase(movementInput: IMovementInput) {
    const { error } = await supabase.from('movements').insert({ ...movementInput, countResults: 0 })
    if (error) throw error
}
