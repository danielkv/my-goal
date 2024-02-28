import { Models } from 'goal-models'

import { supabase } from '@common/providers/supabase'

type TGetClassesBySessionIdResponse = Models<'program_classes_details'>[]

export async function getClassesBySessionIdUseCase(sessionId: string): Promise<TGetClassesBySessionIdResponse> {
    const { error, data } = await supabase
        .from('program_classes_details')
        .select('*')
        .eq('session_id', sessionId)

        .order('name')

    if (error) throw error

    return data
}
