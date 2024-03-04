import { IProgramGroup } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getGroupByIdUseCase(groupId: string): Promise<IProgramGroup> {
    const { error, data } = await supabase
        .from('program_groups_details')
        .select('*, movements:program_movements(*, movement:movements!inner(*))')
        .eq('id', groupId)
        .order('order', { referencedTable: 'program_movements' })
        .single()

    if (error) throw error

    return data as IProgramGroup
}
