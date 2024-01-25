import { IUserMovementResultResponse } from 'goal-models'
import { getPagination } from 'goal-utils'

import { supabase } from '@common/providers/supabase'

export async function getMovementResultsByUserIdUseCase(
    userId: string,
    movementId: string,
    pageIndex: number,
    limit = 10,
    onlyMe = false
): Promise<IUserMovementResultResponse[]> {
    let query = supabase.from('movement_results').select('*, user:profiles(*)').eq('movementId', movementId)

    if (onlyMe) query = query.eq('userId', userId)
    else query = query.or(`userId.eq.${userId}, isPrivate.eq.false`)

    query = query.not('userId', 'is', null)

    const { from, to } = getPagination({ page: pageIndex, pageSize: limit })

    const { data, error } = await query.range(from, to).order('date', { ascending: false })
    if (error) throw error

    //@ts-expect-error
    return data
}
