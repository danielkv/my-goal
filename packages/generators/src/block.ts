import { sections } from './staticData'
import { faker } from '@faker-js/faker'
import { ISection } from 'goal-models'

export function createSection(): ISection {
    return faker.helpers.arrayElement(sections)
}
