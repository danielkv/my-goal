import { describe, expect, it } from 'vitest'

import { IEventMovement } from '@models/block'

import { movementDisplay } from './movement'

describe('Movement display', () => {
    it('10 Snatch 50kg', () => {
        const outputText = `10 Snatch 50kg`

        const object: IEventMovement = {
            name: 'Snatch',
            reps: '10',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('10 Snatch - DB Clean Jerk 50kg', () => {
        const outputText = `10 Snatch - DB Clean Jerk 50kg`

        const object: IEventMovement = {
            name: 'Snatch - DB Clean Jerk',
            reps: '10',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('Snatch 50kg', () => {
        const outputText = 'Snatch 50kg'

        const object: IEventMovement = {
            name: 'Snatch',
            reps: '',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('Snatch', () => {
        const outputText = 'Snatch'

        const object: IEventMovement = {
            name: 'Snatch',
            reps: '',
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('3 Snatch 50%', () => {
        const outputText = '3 Snatch 50%'

        const object: IEventMovement = {
            name: 'Snatch',
            reps: '3',
            weight: {
                type: '%',
                value: '50',
            },
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('3 Hang Snatch 30lb', () => {
        const outputText = '3 Hang Snatch 30lb'

        const object: IEventMovement = {
            name: 'Hang Snatch',
            reps: '3',
            weight: {
                type: 'lb',
                value: '30',
            },
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('8x Pull-up 60lb', () => {
        const outputText = '8x Pull-up 60lb'

        const object: IEventMovement = {
            name: 'Pull-up',
            reps: '8x',
            weight: {
                type: 'lb',
                value: '60',
            },
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('10/8 Snatch 50kg', () => {
        const outputText = '10/8 Snatch 50kg'

        const object: IEventMovement = {
            name: 'Snatch',
            reps: '10/8',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('10 Snatch 50/40%', () => {
        const outputText = '10 Snatch 50/40%'

        const object: IEventMovement = {
            name: 'Snatch',
            reps: '10',
            weight: {
                type: '%',
                value: '50/40',
            },
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('2-5-6 Snatch / Hang Snatch 50kg', () => {
        const outputText = '2-5-6 Snatch / Hang Snatch 50kg'

        const object: IEventMovement = {
            name: 'Snatch / Hang Snatch',
            reps: '2-5-6',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('10/8-8/6-6/4 DB Snatch 20/15kg', () => {
        const outputText = '10/8-8/6-6/4 DB Snatch 20/15kg'

        const object: IEventMovement = {
            name: 'DB Snatch',
            reps: '10/8-8/6-6/4',
            weight: {
                type: 'kg',
                value: '20/15',
            },
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('10cal Assault Bike', () => {
        const outputText = '10cal Assault Bike'

        const object: IEventMovement = {
            name: 'Assault Bike',
            reps: '10cal',
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('1º 30s Box step', () => {
        const outputText = '1º 30s Box step'

        const object: IEventMovement = {
            name: 'Box step',
            reps: '1º 30s',
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })

    it('10cal Assault Bike / 2cal Rino Bike', () => {
        const outputText = '10cal Assault Bike / 2cal Rino Bike'

        const object: IEventMovement = {
            name: 'Assault Bike / 2cal Rino Bike',
            reps: '10cal',
        }

        const converted = movementDisplay.display(object)

        expect(converted).eq(outputText)
    })
})
