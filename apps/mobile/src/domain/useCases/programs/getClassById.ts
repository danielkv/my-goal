import { Models } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getClassByIdUseCase(classId: string): Promise<Models<'program_classes_details'>> {
    const { error, data } = await supabase.from('program_classes_details').select('*').eq('id', classId).single()
    if (error) throw error

    return data
}
