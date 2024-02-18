import { IUserWorkoutResultResponse } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function getLastWorkoutResultsBySignatureUseCase(
    userId: string,
    workoutSignature: string,
    limit = 10,
    onlyMe = false
): Promise<IUserWorkoutResultResponse[]> {
    const query = supabase
        .from('workout_results')
        .select('*, user:profiles(*)')
        .eq('workoutSignature', workoutSignature)

    if (onlyMe) query.eq('userId', userId)
    else query.or(`userId.eq.${userId}, isPrivate.eq.false`)

    const { data, error } = await query.limit(limit).order('date', { ascending: false })

    if (error) throw error

    //@ts-expect-error
    return data
}
