import { movementTransformer } from './movement'
import { IEventMovement } from 'goal-models'
import { describe, expect, it } from 'vitest'

describe('Movement transformer toObject and back toString', () => {
    it('10   Snatch 50kg', () => {
        const inputText = `10   Snatch 50kg`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '10',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)

        const outputText = `10 Snatch 50kg`

        const converted = movementTransformer.toString(object)

        expect(converted).eq(outputText)
    })

    it('10 Snatch - DB Clean Jerk    50kg', () => {
        const inputText = `10 Snatch - DB Clean Jerk    50kg`
        const outputText = `10 Snatch - DB Clean Jerk 50kg`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Snatch - DB Clean Jerk',
            reps: '10',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(outputText)
    })

    it('Snatch 50kg', () => {
        const inputText = `Snatch 50kg`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })

    it('Snatch', () => {
        const inputText = `Snatch`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '',
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })
    it('3x Snatch 50%', () => {
        const inputText = `3x Snatch 50%`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '3x',
            weight: {
                type: '%',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })
    it('3 Hang Snatch 30lb', () => {
        const inputText = `3 Hang Snatch 30lb`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Hang Snatch',
            reps: '3',
            weight: {
                type: 'lb',
                value: '30',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })
    it('8x Pull-up', () => {
        const inputText = `8x Pull-up 60lb`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Pull-up',
            reps: '8x',
            weight: {
                type: 'lb',
                value: '60',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })
    it('10/8 Snatch 50kg', () => {
        const inputText = `10/8 Snatch 50kg`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '10/8',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })

    it('10 Snatch 50/40%', () => {
        const inputText = `10 Snatch 50/40%`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '10',
            weight: {
                type: '%',
                value: '50/40',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })
    it('2-5-6 Snatch / Hang Snatch 50kg', () => {
        const inputText = `2-5-6 Snatch / Hang Snatch 50kg`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Snatch / Hang Snatch',
            reps: '2-5-6',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })
    it('10/8-8/6-6/4 DB Snatch 20/15kg', () => {
        const inputText = `10/8-8/6-6/4 DB Snatch 20/15kg`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'DB Snatch',
            reps: '10/8-8/6-6/4',
            weight: {
                type: 'kg',
                value: '20/15',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })
    it('10cal Assault Bike', () => {
        const inputText = `10cal Assault Bike`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Assault Bike',
            reps: '10cal',
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })

    it('max Assault Bike', () => {
        const inputText = `max Assault Bike`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Assault Bike',
            reps: 'max',
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })

    it('1º 30s Box step', () => {
        const inputText = `1º 30s Box step`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Box step',
            reps: '1º 30s',
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })

    it('10cal Assault Bike / 2cal Rino Bike', () => {
        const inputText = `10cal Assault Bike / 2cal Rino Bike`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Assault Bike / 2cal Rino Bike',
            reps: '10cal',
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(inputText)
    })

    it('max Assault Bike:https://www.youtube.com...', () => {
        const inputText = `max Assault Bike:https://www.youtube.com/watch?v=ivDB23Kcv-A&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4`
        const outputText = `max Assault Bike : https://www.youtube.com/watch?v=ivDB23Kcv-A&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Assault Bike',
            reps: 'max',
            videoUrl: 'https://www.youtube.com/watch?v=ivDB23Kcv-A&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4',
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(outputText)
    })

    it('10/8 Deadlift 70%:   https://www.youtube.com...', () => {
        const inputText = `10/8 Deadlift 70%:   https://www.youtube.com/watch?v=1ZXobu7JvvE&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4`
        const outputText = `10/8 Deadlift 70% : https://www.youtube.com/watch?v=1ZXobu7JvvE&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Deadlift',
            reps: '10/8',
            videoUrl: 'https://www.youtube.com/watch?v=1ZXobu7JvvE&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4',
            weight: {
                type: '%',
                value: '70',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(outputText)
    })

    it('10/8 Deadlift 70%   : https://www.youtube.com...', () => {
        const inputText = `10/8 Deadlift 70%   : https://www.youtube.com/watch?v=1ZXobu7JvvE&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4`
        const outputText = `10/8 Deadlift 70% : https://www.youtube.com/watch?v=1ZXobu7JvvE&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Deadlift',
            reps: '10/8',
            videoUrl: 'https://www.youtube.com/watch?v=1ZXobu7JvvE&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4',
            weight: {
                type: '%',
                value: '70',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(outputText)
    })

    it('10/8 Deadlift 70% :https://www.youtube.com...', () => {
        const inputText = `10/8 Deadlift 70% :https://www.youtube.com/watch?v=1ZXobu7JvvE&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4`
        const outputText = `10/8 Deadlift 70% : https://www.youtube.com/watch?v=1ZXobu7JvvE&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4`

        const object = movementTransformer.toObject(inputText)

        const expected: IEventMovement = {
            name: 'Deadlift',
            reps: '10/8',
            videoUrl: 'https://www.youtube.com/watch?v=1ZXobu7JvvE&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4',
            weight: {
                type: '%',
                value: '70',
            },
        }

        expect(object).toMatchObject(expected)

        const converted = movementTransformer.toString(object)

        expect(converted).eq(outputText)
    })
})
