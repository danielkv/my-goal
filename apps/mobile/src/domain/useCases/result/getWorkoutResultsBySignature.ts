import dayjs from 'dayjs'
import { createUser } from 'goal-generators'
import { IUserWorkoutResult, IUserWorkoutResultResponse } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { faker } from '@faker-js/faker'
import { FilterFunction } from '@react-native-firebase/firestore'

export async function getLastWorkoutResultsBySignatureUseCase(
    userId: string,
    workougSignature: string
): Promise<IUserWorkoutResultResponse[]> {
    const fs = firebaseProvider.getFirestore()

    const collectionRef = fs.collection<IUserWorkoutResult>(collections.WORKOUT_RESULTS)

    const resultsSnapshot = await collectionRef.get()

    const userIds = resultsSnapshot.docs.map((doc) => doc.data().uid)

    const results: IUserWorkoutResultResponse[] = [
        {
            id: faker.string.uuid(),
            uid: faker.string.uuid(),
            createdAt: dayjs('2023-07-31').toISOString(),
            user: createUser({ uid: userId }),
            date: dayjs('2023-07-31').toISOString(),
            isPrivate: true,
            result: { type: 'time', value: 1000 },
            workoutSignature: faker.string.uuid(),
            workout: {
                config: { type: 'amrap', timecap: 120, numberOfRounds: 6 },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed' },
                        movements: [
                            {
                                reps: '5',
                                name: 'RMU e BMU syncro',
                            },
                            {
                                reps: '5',
                                name: 'OHS syncro',
                                weight: {
                                    type: 'kg',
                                    value: '60/40',
                                },
                            },
                            {
                                reps: '',
                                name: 'burpees over the bar syncro',
                            },
                        ],
                    },
                    {
                        movements: [],
                        time: 120,
                        type: 'rest',
                    },
                ],
            },
        },
        {
            id: faker.string.uuid(),
            uid: faker.string.uuid(),
            user: createUser(),
            createdAt: dayjs('2023-07-31').toISOString(),
            date: dayjs('2023-07-31').toISOString(),
            isPrivate: true,
            result: { type: 'time', value: 1000 },
            workoutSignature: faker.string.uuid(),
            workout: {
                config: { type: 'not_timed', numberOfRounds: 5 },
                type: 'event',
                rounds: [
                    {
                        movements: [
                            {
                                reps: '200m',
                                name: 'run',
                            },
                            {
                                reps: '3',
                                name: 'wall walk syncro',
                            },
                            {
                                reps: '10',
                                name: 'T2B Syncro',
                            },
                            {
                                reps: '10',
                                name: 'Hang Squat CLean syncro com 2 DB',
                            },
                        ],
                        config: { type: 'not_timed' },
                    },
                ],

                info: 'em duplas',
            },
        },
        {
            id: faker.string.uuid(),
            uid: faker.string.uuid(),
            user: createUser(),
            createdAt: dayjs('2023-07-30').toISOString(),
            date: dayjs('2023-07-31').toISOString(),
            isPrivate: true,
            result: { type: 'time', value: 1000 },
            workoutSignature: faker.string.uuid(),
            workout: {
                config: { type: 'amrap', timecap: 120, numberOfRounds: 6 },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed' },
                        movements: [
                            {
                                reps: '5',
                                name: 'RMU e BMU syncro',
                            },
                            {
                                reps: '5',
                                name: 'OHS syncro',
                                weight: {
                                    type: 'kg',
                                    value: '60/40',
                                },
                            },
                            {
                                reps: '',
                                name: 'burpees over the bar syncro',
                            },
                        ],
                    },
                    {
                        movements: [],
                        time: 120,
                        type: 'rest',
                    },
                ],
            },
        },
        {
            id: faker.string.uuid(),
            uid: faker.string.uuid(),
            user: createUser(),
            createdAt: dayjs('2023-07-29').toISOString(),
            date: dayjs('2023-07-31').toISOString(),
            isPrivate: true,
            result: { type: 'time', value: 1000 },
            workoutSignature: faker.string.uuid(),
            workout: {
                config: { type: 'not_timed', numberOfRounds: 5 },
                type: 'event',
                rounds: [
                    {
                        movements: [
                            {
                                reps: '200m',
                                name: 'run',
                            },
                            {
                                reps: '3',
                                name: 'wall walk syncro',
                            },
                            {
                                reps: '10',
                                name: 'T2B Syncro',
                            },
                            {
                                reps: '10',
                                name: 'Hang Squat CLean syncro com 2 DB',
                            },
                        ],
                        config: { type: 'not_timed' },
                    },
                ],

                info: 'em duplas',
            },
        },
    ]

    return results
}
