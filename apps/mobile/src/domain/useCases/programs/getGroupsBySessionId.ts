import { Models } from 'goal-models'

import { supabase } from '@common/providers/supabase'

type TGetGroupsBySessionIdResponse = Models<'program_groups_details'> & { movements: Models<'program_movements'>[] }

export async function getGroupsBySessionIdUseCase(sessionId: string): Promise<TGetGroupsBySessionIdResponse[]> {
    const { error, data } = await supabase
        .from('program_groups_details')
        .select('*, movements:program_movements(*)')
        .eq('session_id', sessionId)
        .order('order')
        .order('order', { referencedTable: 'program_movements' })

    if (error) throw error

    return data
}
