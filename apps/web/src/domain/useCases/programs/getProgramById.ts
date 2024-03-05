import { IProgram } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getProgramByIdUseCase(id: string): Promise<IProgram> {
    const { error, data } = await supabase
        .from('programs')
        .select(
            '*, segments:program_segments(*, sessions:program_sessions(*, groups:program_groups(*, movements:program_movements(*))))'
        )
        .eq('id', id)
        .order('order', { referencedTable: 'program_segments' })
        .order('order', { referencedTable: 'program_segments.program_sessions' })
        .order('order', { referencedTable: 'program_segments.program_sessions.program_groups' })
        .order('order', { referencedTable: 'program_segments.program_sessions.program_groups.program_movements' })
        .single()

    if (error) throw error

    return data
}
