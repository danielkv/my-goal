import { IUserData, IUserWorkoutResult, IUserWorkoutResultResponse } from 'goal-models'
import { collections } from 'goal-utils'

import { WorkoutResultFilter } from '@common/interfaces/workoutResult'
import { firebaseProvider } from '@common/providers/firebase'
import { Filter, FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export async function mergeWorkoutResultAndUser(
    docs: FirebaseFirestoreTypes.QueryDocumentSnapshot<IUserWorkoutResult>[]
): Promise<IUserWorkoutResultResponse[]> {
    const fs = firebaseProvider.getFirestore()

    const userRef = fs.collection<IUserData>(collections.USER_DATA)

    const userIds = docs.map((doc) => doc.data().uid)

    const userSnapthot = await userRef.where('uid', 'in', userIds).get()

    const usersObj = userSnapthot.docs.reduce<Record<string, IUserData>>((acc, doc) => {
        const data = doc.data()
        acc[data.uid] = data
        return acc
    }, {})

    return docs.reduce<IUserWorkoutResultResponse[]>((acc, doc) => {
        const resData = doc.data()
        const user = usersObj[resData.uid]

        if (user)
            acc.push({
                ...resData,
                id: doc.id,
                user,
            })

        return acc
    }, [])
}

export function getWorkoutResultFilters(
    query: FirebaseFirestoreTypes.Query<IUserWorkoutResult>,
    filter: WorkoutResultFilter
): FirebaseFirestoreTypes.Query<IUserWorkoutResult> {
    if (filter.onlyMe) {
        query = query.where(Filter('uid', '==', filter.userId))
    } else {
        query = query.where(Filter.or(Filter('uid', '==', filter.userId), Filter('isPrivate', '==', false)))
    }

    return query
}
