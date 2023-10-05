import { IMovement, IUserMovementResult, IUserMovementResultListResponse } from 'goal-models'
import { collections } from 'goal-utils'
import { cluster, group, map, sort } from 'radash'

import { firebaseProvider } from '@common/providers/firebase'

export async function getMovementsUseCase(
    userId: string,
    search: string,
    startAfter?: string | null,
    limit = 40
): Promise<IUserMovementResultListResponse[]> {
    const fs = firebaseProvider.getFirestore()

    const movementCollection = fs.collection<Omit<IMovement, 'id'>>(collections.MOVEMENTS)
    const userMovementResult = fs.collection<Omit<IUserMovementResult, 'id'>>(collections.MOVEMENT_RESULTS)

    const insensitive_search = search.toLocaleLowerCase()

    let query = movementCollection.orderBy('movement_insensitive', 'asc')

    if (search.length)
        query = query
            .where('movement_insensitive', '>=', insensitive_search)
            .where('movement_insensitive', '<', insensitive_search + '\uf8ff')

    if (startAfter) {
        const startAfterSnapshot = await movementCollection.doc(startAfter).get()
        if (startAfterSnapshot.exists) query = query.startAfter(startAfterSnapshot)
    }

    const movementsSnapshot = await query.limit(limit).get({ source: 'server' })

    if (movementsSnapshot.empty) return []

    const movementIds = cluster(
        movementsSnapshot.docs.map((doc) => doc.id),
        10
    )

    const userResults = await map(movementIds, (ids) =>
        userMovementResult
            .where('uid', '==', userId)
            .where('movementId', 'in', ids)
            // @ts-expect-error
            .orderBy('result.value', 'desc')
            .get()
    )

    const userResultsSnapshot = userResults.map((s) => s.docs).flat()

    const userResultGroups = group(userResultsSnapshot, (f) => f.data().movementId)

    const results = movementsSnapshot.docs.map<IUserMovementResultListResponse>((doc) => {
        const userResult = userResultGroups[doc.id]
        if (!userResult)
            return {
                movement: { ...doc.data(), id: doc.id },
            }

        const data = doc.data()

        const mainUserResult =
            data.resultType === 'time' ? sort(userResult, (a) => a.data().result.value)[0] : userResult[0]

        return {
            result: { ...mainUserResult.data(), id: mainUserResult.id },
            movement: { ...data, id: doc.id },
        }
    })

    return results
}
