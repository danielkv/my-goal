import { describe, expect, it } from 'vitest'

import { IRound } from '@models/block'

import { roundDisplay } from './round'

describe('Round displayHeader', () => {
    it('no header', () => {
        const outputText = ''

        const object: IRound = {
            type: 'not_timed',
            movements: [
                {
                    name: 'Snatch - DB Clean Jerk',
                    reps: '10',
                    weight: {
                        type: 'kg',
                        value: '50',
                    },
                },
                {
                    name: 'Snatch',
                    reps: '',
                    weight: {
                        type: 'kg',
                        value: '50',
                    },
                },
                {
                    name: 'Snatch',
                    reps: '',
                },
            ],
        }

        const displayed = roundDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "For Time"', () => {
        const outputText = 'For Time'

        const object: IRound = {
            type: 'for_time',
            numberOfRounds: 1,
            timecap: 0,
            movements: [
                {
                    name: 'Muscle Clean',
                    reps: '5',
                    weight: {
                        type: '%',
                        value: '50',
                    },
                },
                {
                    name: 'Pull-Up',
                    reps: '10',
                },
            ],
        }

        const displayed = roundDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "For Time 2 rounds 3min"', () => {
        const outputText = 'For Time 2 rounds 3min'

        const object: IRound = {
            type: 'for_time',
            numberOfRounds: 2,
            timecap: 180,
            movements: [
                {
                    name: 'Pull-Up',
                    reps: '10',
                },
            ],
        }

        const displayed = roundDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "AMRAP 4 rounds 3min"', () => {
        const outputText = 'AMRAP 4 rounds 3min'

        const object: IRound = {
            type: 'amrap',
            numberOfRounds: 4,
            timecap: 180,
            movements: [
                {
                    name: 'Pull-Up',
                    reps: '10',
                },
            ],
        }

        const displayed = roundDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "EMOM 30 rounds 1min30s"', () => {
        const outputText = 'EMOM 30 rounds 1min30s'

        const object: IRound = {
            type: 'emom',
            numberOfRounds: 30,
            each: 90,
            movements: [
                {
                    name: 'Pull-Up',
                    reps: '10',
                },
            ],
        }

        const displayed = roundDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "E3M 15min"', () => {
        const outputText = 'E3M 15min'

        const object: IRound = {
            type: 'emom',
            numberOfRounds: 5,
            each: 180,
            movements: [
                {
                    name: 'Pull-Up',
                    reps: '10',
                },
            ],
        }

        const displayed = roundDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "EMOM 30min"', () => {
        const outputText = 'EMOM 30min'

        const object: IRound = {
            type: 'emom',
            numberOfRounds: 30,
            each: 60,
            movements: [
                {
                    name: 'Hang Clean',
                    reps: '10',
                },
            ],
        }

        const displayed = roundDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "Tabata 4 rounds 20s/10s"', () => {
        const outputText = 'Tabata 4 rounds 20s/10s'

        const object: IRound = {
            type: 'tabata',
            numberOfRounds: 4,
            work: 20,
            rest: 10,
            movements: [
                {
                    name: 'Hang Clean',
                    reps: '10',
                },
            ],
        }

        const displayed = roundDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "Tabata"', () => {
        const outputText = 'Tabata'

        const object: IRound = {
            type: 'tabata',
            numberOfRounds: 8,
            work: 20,
            rest: 10,
            movements: [
                {
                    name: 'Hang Clean',
                    reps: '10',
                },
            ],
        }

        const displayed = roundDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "21-15-9 rounds"', () => {
        const outputText = '21-15-9 rounds'

        const object: IRound = {
            type: 'not_timed',
            numberOfRounds: 3,
            movements: [
                {
                    name: 'Deadlift',
                    reps: '21-15-9',
                },
                {
                    name: 'Hang Clean',
                    reps: '21-15-9',
                },
            ],
        }

        const displayed = roundDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "2 rounds"', () => {
        const outputText = '2 rounds'

        const object: IRound = {
            type: 'not_timed',
            numberOfRounds: 2,
            movements: [
                {
                    name: 'Pull-Up',
                    reps: '10',
                },
            ],
        }

        const displayed = roundDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })
})

describe('Round display', () => {
    it('Rest round "2min Rest"', () => {
        const outputText = '2min Rest'

        const object: IRound = {
            type: 'rest',
            time: 120,
            movements: [],
        }

        const displayed = roundDisplay.display(object)

        expect(displayed).eq(outputText)
    })

    it('Round complex "Deadlift + Hang Clean"', () => {
        const outputText = 'Deadlift + Hang Clean'

        const object: IRound = {
            type: 'complex',
            movements: [
                {
                    name: 'Deadlift',
                    reps: '',
                },
                {
                    name: 'Hang Clean',
                    reps: '',
                },
            ],
        }

        const displayed = roundDisplay.display(object)

        expect(displayed).eq(outputText)
    })
})
