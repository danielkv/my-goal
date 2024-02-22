import { IProgram } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getProgramByIdUseCase(id: string): Promise<IProgram> {
    const { error, data } = await supabase
        .from('programs')
        .select('*, segments:program_segments(*, sessions:program_sessions(*, classes:program_classes(*)))')
        .eq('id', id)
        .single()

    if (error) throw error

    return data
}
