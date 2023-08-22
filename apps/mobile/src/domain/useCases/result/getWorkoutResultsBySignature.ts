import { IUserData, IUserWorkoutResult, IUserWorkoutResultResponse } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { Filter } from '@react-native-firebase/firestore'

export async function getLastWorkoutResultsBySignatureUseCase(
    userId: string,
    workoutSignature: string,
    limit = 4
): Promise<IUserWorkoutResultResponse[]> {
    const fs = firebaseProvider.getFirestore()

    const collectionRef = fs.collection<IUserWorkoutResult>(collections.WORKOUT_RESULTS)
    const userRef = fs.collection<IUserData>(collections.USER_DATA)

    const resultsSnapshot = await collectionRef
        .where('workoutSignature', '==', workoutSignature)
        .where(Filter.or(Filter('uid', '==', userId), Filter('isPrivate', '==', false)))
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get()

    if (resultsSnapshot.empty) return []

    const userIds = resultsSnapshot.docs.map((doc) => doc.data().uid)

    const userSnapthot = await userRef.where('uid', 'in', userIds).get()

    const usersObj = userSnapthot.docs.reduce<Record<string, IUserData>>((acc, doc) => {
        const data = doc.data()
        acc[data.uid] = data
        return acc
    }, {})

    const results = resultsSnapshot.docs.reduce<IUserWorkoutResultResponse[]>((acc, doc) => {
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

    return results
}
