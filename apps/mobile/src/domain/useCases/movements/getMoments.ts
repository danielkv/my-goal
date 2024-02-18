import { IUserMovementResultListResponse, Models } from 'goal-models'
import { getPagination } from 'goal-utils'
import { objectify } from 'radash'

import { supabase } from '@common/providers/supabase'

export async function getMovementsUseCase(
    userId: string,
    search: string,
    page: number,
    pageSize = 20
): Promise<IUserMovementResultListResponse[]> {
    const { from, to } = getPagination({ page, pageSize })

    const movementsQuery = supabase.from('movements').select('*').order('movement').range(from, to)

    if (search) movementsQuery.ilike('movement', `%${search}%`)

    const { data: movements, error } = await movementsQuery
    if (error) throw error

    const { data: userResults, error: resultsError } = await supabase
        .from('highest_movement_results')
        .select('*')
        .eq('userId', userId)
        .in(
            'movementId',
            movements.map((doc) => doc.id)
        )

    if (resultsError) throw resultsError

    const userResultGroups = objectify(userResults, (i) => i.movementId || '') as Record<
        string,
        Models<'highest_movement_results'>
    >

    const results = movements.map<IUserMovementResultListResponse>((doc) => {
        const userResult = userResultGroups[doc.id]
        if (!userResult)
            return {
                movement: doc,
            }

        return {
            result: userResult,
            movement: doc,
        }
    })

    return results
}
