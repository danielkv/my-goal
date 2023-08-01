import dayjs from 'dayjs'
import { IUserWorkoutResult } from 'goal-models'
import { group } from 'radash'

import { faker } from '@faker-js/faker'

type TGrouptWorkoutResults = (IUserWorkoutResult | string)[]

export async function getUserWorkoutsByUserIdUseCase(userId: string): Promise<TGrouptWorkoutResults> {
    const results: IUserWorkoutResult[] = [
        {
            id: faker.string.uuid(),
            uid: faker.string.uuid(),
            createdAt: dayjs('2023-07-31').toISOString(),
            public: true,
            result: { type: 'time', value: 1000 },
            workoutId: faker.string.uuid(),
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
            createdAt: dayjs('2023-07-31').toISOString(),
            public: true,
            result: { type: 'time', value: 1000 },
            workoutId: faker.string.uuid(),
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
            createdAt: dayjs('2023-07-30').toISOString(),
            public: true,
            result: { type: 'time', value: 1000 },
            workoutId: faker.string.uuid(),
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
            createdAt: dayjs('2023-07-29').toISOString(),
            public: true,
            result: { type: 'time', value: 1000 },
            workoutId: faker.string.uuid(),
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

    const groups = group(results, (item) => dayjs(item.createdAt).format('YYYY-MM-DD'))

    return _convertToSection(groups)
}

function _convertToSection(groups: Partial<Record<string, IUserWorkoutResult[]>>): TGrouptWorkoutResults {
    return Object.entries(groups).reduce<TGrouptWorkoutResults>((acc, [date, workouts]) => {
        if (!workouts) return acc

        acc.push(date)
        acc.push(...workouts)

        return acc
    }, [])
}
