import { IUserMovementResultResponse, TResultType } from 'goal-models'
import { getPagination } from 'goal-utils'
import { omit } from 'radash'

import { supabase } from '@common/providers/supabase'

export async function getMovementResultsByUserIdUseCase(
    userId: string,
    movementId: number,
    resultType: TResultType,
    pageIndex: number,
    limit = 10,
    onlyMe = false
): Promise<IUserMovementResultResponse[]> {
    const query = supabase.from('movement_results').select('*, profiles(*)').eq('movementId', movementId)

    if (onlyMe) query.eq('userId', userId)
    else query.or(`userId.eq.${userId}, isPrivate.eq.false`)

    const { from, to } = getPagination({ page: pageIndex, pageSize: limit })

    const { data, error } = await query.range(from, to).order('date', { ascending: false })
    if (error) throw error

    return data.map((item) => ({ ...omit(item, ['profiles']), user: item.profiles[0] }))
}
