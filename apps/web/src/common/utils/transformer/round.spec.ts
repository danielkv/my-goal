import { describe, expect, it } from 'vitest'

import { IRound } from '@models/block'

import { BaseTransformer } from './base'
import { roundTransformer } from './round'

const baseTransformer = new BaseTransformer()

describe('Round transformer toObject', () => {
    describe('Header and Movements', () => {
        it('3 movements no header', () => {
            const inputText = `10 Snatch - DB Clean Jerk    50kg
		Snatch 50kg
		Snatch`

            const outputText = `10 Snatch - DB Clean Jerk 50kg
		Snatch 50kg
		Snatch`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('2 movements no header', () => {
            const inputText = `5 Muscle Clean 50%
			10 Pull-Up`
            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'not_timed',
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(inputText))
        })

        it('2 movements with header "1 for time"', () => {
            const inputText = `for time 1
			5 Muscle Clean 50%
			10 Pull-Up`

            const outputText = `for time
			5 Muscle Clean 50%
			10 Pull-Up`
            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "fortime 2 3min"', () => {
            const inputText = `fortime 2 3min
			10 Pull-Up`
            const outputText = `for time 2 rounds 3min
			10 Pull-Up`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "2 3min"', () => {
            const inputText = `2 3min
			10 Pull-Up`

            const outputText = `for time 2 rounds 3min
			10 Pull-Up`
            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "amrap 4x 3min"', () => {
            const inputText = `amrap 4x 3min
			10 Pull-Up`

            const outputText = `amrap 4 rounds 3min
			10 Pull-Up`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "amrap 4 rounds 30s"', () => {
            const inputText = `amrap 4 rounds 30s
			10 Pull-Up`

            const outputText = `amrap 4 rounds 30s
			10 Pull-Up`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'amrap',
                numberOfRounds: 4,
                timecap: 30,
                movements: [
                    {
                        name: 'Pull-Up',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "emom 30 1m30s"', () => {
            const inputText = `emom 30 1m30s
			10 Pull-Up`

            const outputText = `emom 30 rounds 1min30s
			10 Pull-Up`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "e3m 15min"', () => {
            const inputText = `e3m 15min
			10 Pull-Up`

            const outputText = `E3M 15min
			10 Pull-Up`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "emom 4 rounds 1min34s"', () => {
            const inputText = `emom 4 rounds 1min34s
			10 Hang Clean`

            const outputText = `emom 4 rounds 1min34s
			10 Hang Clean`
            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'emom',
                numberOfRounds: 4,
                each: 94,
                movements: [
                    {
                        name: 'Hang Clean',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "emom 4 30"', () => {
            const inputText = `emom 4 30
			10 Hang Clean`

            const outputText = `emom 4 rounds 30s
			10 Hang Clean`
            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'emom',
                numberOfRounds: 4,
                each: 30,
                movements: [
                    {
                        name: 'Hang Clean',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "emom 30 1min"', () => {
            const inputText = `emom 30 1min
			10 Hang Clean`

            const outputText = `emom 30min
			10 Hang Clean`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "emom 40min"', () => {
            const inputText = `emom 40min
			10 Hang Clean`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'emom',
                numberOfRounds: 40,
                each: 60,
                movements: [
                    {
                        name: 'Hang Clean',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(inputText))
        })

        it('header "tabata 4 rounds 20s/10s"', () => {
            const inputText = `tabata 4 rounds 20s/10s
			10 Hang Clean`

            const outputText = `tabata 4 rounds 20s/10s
			10 Hang Clean`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "tabata 4 rounds 20/10"', () => {
            const inputText = `tabata 4 rounds 20/10
			10 Hang Clean`

            const outputText = `tabata 4 rounds 20s/10s
			10 Hang Clean`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "tabata 4 rounds"', () => {
            const inputText = `tabata 4 rounds
			10 Hang Clean`

            const outputText = `tabata 4 rounds 20s/10s
			10 Hang Clean`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "tabata"', () => {
            const inputText = `tabata
			10 Hang Clean`
            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(inputText))
        })

        it('header "fortime 21-15-9"', () => {
            const inputText = `fortime 21-15-9
			Deadlift
			Hang Clean`

            const outputText = `for time 21-15-9 rounds
			Deadlift
			Hang Clean`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'for_time',
                numberOfRounds: 3,
                timecap: 0,
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "fortime 21-15-9 5min"', () => {
            const inputText = `fortime 21-15-9 5min
			Deadlift
			Hang Clean`

            const outputText = `for time 21-15-9 rounds 5min
			Deadlift
			Hang Clean`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'for_time',
                numberOfRounds: 3,
                timecap: 300,
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('header "21-15-9"', () => {
            const inputText = `21-15-9
			Deadlift
			Hang Clean`

            const outputText = `21-15-9 rounds
			Deadlift
			Hang Clean`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })
    })

    describe('Complex and Rest rounds', () => {
        it('2min rest"', () => {
            const inputText = `2min rest`
            const outputText = `2min Rest`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'rest',
                time: 120,
                movements: [],
            }
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('Rest 1min30s', () => {
            const inputText = `Rest 1min30s`
            const outputText = `1min30s Rest`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'rest',
                time: 90,
                movements: [],
            }
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('Deadlift + Hang Clean', () => {
            const inputText = `Deadlift + Hang Clean`
            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
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
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(inputText))
        })

        it('Deadlift + Hang Clean 50kg', () => {
            const inputText = `Deadlift + Hang Clean  50kg`
            const outputText = `Deadlift + Hang Clean 50kg`

            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'complex',
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                    {
                        name: 'Hang Clean',
                        reps: '',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                ],
            }
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })

        it('5 Deadlift + Hang Clean 50kg', () => {
            const inputText = `3 Deadlift + 2 Hang Clean 50kg`
            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'complex',
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '3',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                    {
                        name: 'Hang Clean',
                        reps: '2',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                ],
            }
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(inputText))
        })

        it('3 Deadlift + 2 Hang Clean 50kg with header "3 rounds"', () => {
            const inputText = `3 rounds
			3 Deadlift + 2 Hang Clean 50kg`
            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'complex',
                numberOfRounds: 3,
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '3',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                    {
                        name: 'Hang Clean',
                        reps: '2',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                ],
            }
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(inputText))
        })

        it('Deadlift + Hang Clean 50/40% with header "10-9-8-7-6-5-4-3-2-1"', () => {
            const inputText = `10-9-8-7-6-5-4-3-2-1x
			Deadlift + Hang Clean 50/40%`

            const outputText = `10-9-8-7-6-5-4-3-2-1
			Deadlift + Hang Clean 50/40%`
            const object = roundTransformer.toObject(inputText) as IRound

            const expected: IRound = {
                type: 'complex',
                numberOfRounds: 10,
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '10-9-8-7-6-5-4-3-2-1',
                        weight: {
                            type: '%',
                            value: '50/40',
                        },
                    },
                    {
                        name: 'Hang Clean',
                        reps: '10-9-8-7-6-5-4-3-2-1',
                        weight: {
                            type: '%',
                            value: '50/40',
                        },
                    },
                ],
            }
            expect(object).toMatchObject(expected)

            const converted = roundTransformer.toString(object)

            expect(converted).eq(baseTransformer.normalizeText(outputText))
        })
    })
})
