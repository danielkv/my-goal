import { IUserWorkoutResultResponse } from 'goal-models'
import { getPagination } from 'goal-utils'
import { omit } from 'radash'

import { supabase } from '@common/providers/supabase'

export async function getWorkoutResultsBySignatureUseCase(
    userId: string,
    workoutSignature: string,
    pageIndex: number,
    limit = 10,
    onlyMe = false
): Promise<IUserWorkoutResultResponse[]> {
    const query = supabase.from('workout_results').select('*, profiles(*)').eq('wokroutSignature', workoutSignature)

    if (onlyMe) query.eq('userId', userId)
    else query.or(`userId.eq.${userId}, isPrivate.eq.false`)
    const { from, to } = getPagination({ page: pageIndex, pageSize: limit })

    const { data, error } = await query.range(from, to).order('date', { ascending: false })

    if (error) throw error

    return data.map((item) => ({ ...omit(item, ['profiles']), user: item.profiles[0] }))
}
