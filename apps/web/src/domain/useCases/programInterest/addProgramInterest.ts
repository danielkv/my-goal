import { ModelsInsert } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function addProgramInterestUseCase(userData: ModelsInsert<'program_interests'>) {
    const { error } = await supabase.from('program_interests').insert(userData)
    if (error) throw error
}
