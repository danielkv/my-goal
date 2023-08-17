import { faker } from '@faker-js/faker'
import { IUserWorkoutResultInput, TResultType } from 'goal-models'

export function createUserWorkoutResult(): IUserWorkoutResultInput {
    const type = faker.helpers.arrayElement<TResultType>(['time', 'reps', 'weight'])
    const value = createValue(type)

    return {
        createdAt: faker.date.recent().toISOString(),
        date: faker.date.recent().toISOString(),
        isPrivate: faker.datatype.boolean(0.3),
        result: { type, value },
        uid: faker.string.uuid(),
        workout: {
            type: 'event',
            config: {
                type: 'not_timed',
            },
            rounds: [
                {
                    movements: [
                        {
                            reps: '3',
                            name: 'min bike',
                        },
                    ],
                    config: {
                        type: 'not_timed',
                    },
                },
            ],
        },
        workoutSignature: faker.string.alphanumeric({ length: 30 }),
    }
}

function createValue(type: TResultType): number {
    switch (type) {
        case 'reps':
            return faker.number.int({ min: 40, max: 100 })
        case 'time':
            return faker.number.int({ min: 60, max: 600 })
        case 'weight':
            return faker.number.int({ min: 70, max: 140 })
    }
}
