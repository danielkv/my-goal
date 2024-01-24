import { IUserWorkoutResult } from 'goal-models'
import { getPagination } from 'goal-utils'

import { supabase } from '@common/providers/supabase'

export async function getUserWorkoutsByUserIdUseCase(
    userId: string,
    page: number,
    pageSize = 10
): Promise<IUserWorkoutResult[]> {
    const { from, to } = getPagination({ page, pageSize })
    const query = supabase.from('workout_results').select('*, profiles(*)').eq('userId', userId)

    const { data, error } = await query.range(from, to).order('date', { ascending: false })

    if (error) throw error

    return data
}
