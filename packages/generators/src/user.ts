import { faker } from '@faker-js/faker'
import { IUserData } from 'goal-models'

export function createUser(data?: Partial<IUserData>): IUserData {
    return {
        displayName: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: faker.datatype.boolean(),
        uid: faker.string.uuid(),
        phoneNumber: faker.phone.number(),
        photoURL: faker.image.avatar(),
        ...data,
    }
}
