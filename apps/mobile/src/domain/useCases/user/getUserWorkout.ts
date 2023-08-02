import dayjs from 'dayjs'
import { createUser } from 'goal-generators'
import { IEventBlock, IUserData, IUserWorkoutResult } from 'goal-models'

import { faker } from '@faker-js/faker'

type TGetUserWorkoutResponse = (IUserWorkoutResult & { user: IUserData })[]

const workout: IEventBlock = {
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
}

export async function getUserWorkoutUseCase(userId: string, workoutId: string): Promise<TGetUserWorkoutResponse> {
    const results: TGetUserWorkoutResponse = [
        {
            id: faker.string.uuid(),
            user: createUser({ uid: userId }),
            uid: userId,
            createdAt: dayjs('2023-07-31').toISOString(),
            isPrivate: faker.datatype.boolean(),
            result: { type: 'time', value: faker.number.int(100) },
            workoutSignature: faker.string.uuid(),
            workout,
        },
        {
            id: faker.string.uuid(),
            uid: faker.string.uuid(),
            user: createUser(),
            createdAt: dayjs('2023-07-31').toISOString(),
            isPrivate: faker.datatype.boolean(),
            result: { type: 'time', value: faker.number.int(100) },
            workoutSignature: faker.string.uuid(),
            workout,
        },
        {
            id: faker.string.uuid(),
            uid: faker.string.uuid(),
            user: createUser(),
            createdAt: dayjs('2023-07-30').toISOString(),
            isPrivate: faker.datatype.boolean(),
            result: { type: 'time', value: faker.number.int(100) },
            workoutSignature: faker.string.uuid(),
            workout,
        },
        {
            id: faker.string.uuid(),
            uid: userId,
            user: createUser({ uid: userId }),
            createdAt: dayjs('2023-07-29').toISOString(),
            isPrivate: faker.datatype.boolean(),
            result: { type: 'time', value: faker.number.int(100) },
            workoutSignature: faker.string.uuid(),
            workout,
        },
    ]

    results.sort((a, b) => b.result.value - a.result.value)

    return results
}
