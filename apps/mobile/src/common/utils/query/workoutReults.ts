import { IUserData, IUserResult, TResultType } from 'goal-models'
import { collections } from 'goal-utils'

import { WorkoutResultFilter } from '@common/interfaces/workoutResult'
import { firebaseProvider } from '@common/providers/firebase'
import { FirebaseFirestoreTypes, firebase } from '@react-native-firebase/firestore'

export async function mergeWorkoutResultAndUser<Type extends IUserResult>(
    docs: FirebaseFirestoreTypes.QueryDocumentSnapshot<Omit<Type, 'id'>>[]
): Promise<(Type & { id: string; user: IUserData })[]> {
    const fs = firebaseProvider.getFirestore()

    const userRef = fs.collection<IUserData>(collections.USER_DATA)

    const userIds = docs.map((doc) => doc.data().uid)

    const userSnapthot = await userRef.where('uid', 'in', userIds).get()

    const usersObj = userSnapthot.docs.reduce<Record<string, IUserData>>((acc, doc) => {
        const data = doc.data()
        acc[data.uid] = data
        return acc
    }, {})

    return docs.reduce<(Type & { id: string; user: IUserData })[]>((acc, doc) => {
        const resData = doc.data()
        const user = usersObj[resData.uid]

        if (user)
            acc.push({
                ...resData,
                id: doc.id,
                user,
            } as Type & { id: string; user: IUserData })

        return acc
    }, [])
}

export function getWorkoutResultFilters<Type extends Omit<IUserResult, 'id'>>(
    query: FirebaseFirestoreTypes.Query<Type>,
    filter: WorkoutResultFilter
): FirebaseFirestoreTypes.Query<Type> {
    if (filter.onlyMe) {
        query = query.where('uid', '==', filter.userId)
    } else {
        query = query.where(
            firebase.firestore.Filter.or(
                firebase.firestore.Filter('uid', '==', filter.userId),
                firebase.firestore.Filter('isPrivate', '==', false)
            )
        )
    }

    return query
}

export function getWorkoutResultOrderBy<Type extends Omit<IUserResult, 'id'>>(
    query: FirebaseFirestoreTypes.Query<Type>,
    resultType: TResultType
): FirebaseFirestoreTypes.Query<Type> {
    switch (resultType) {
        case 'time':
            // @ts-expect-error
            query = query.orderBy('result.value', 'asc')
            break
        default:
            // @ts-expect-error
            query = query.orderBy('result.value', 'desc')
            break
    }

    return query
}
