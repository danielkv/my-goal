import { BaseTransformer } from './base'
import { sectionTransformer } from './section'
import { IBlock } from 'goal-models'
import { describe, expect, it } from 'vitest'

const baseTransformer = new BaseTransformer()

describe('Section transform toObject', () => {
    it('1 movement', () => {
        const inputText = `10 snatch 50kg`

        const object = sectionTransformer.toObject(inputText)

        const expected: IBlock[] = [
            {
                config: { type: 'not_timed' },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed' },
                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
        ]

        expect(object).toMatchObject(expected)

        const converted = sectionTransformer.toString(object)

        expect(converted).eq(baseTransformer.normalizeText(inputText))
    })

    it('header "bloco:   emom 4 1m', () => {
        const inputText = `bloco:   emom 4 1m
		10 snatch 50kg`
        const outputText = `bloco: emom 4min
		10 snatch 50kg`

        const object = sectionTransformer.toObject(inputText)

        const expected: IBlock[] = [
            {
                config: { type: 'emom', numberOfRounds: 4, each: 60 },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed' },
                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
        ]

        expect(object).toMatchObject(expected)

        const converted = sectionTransformer.toString(object)

        expect(converted).eq(baseTransformer.normalizeText(outputText))
    })

    it('1 round with header, 2 movements', () => {
        const inputText = `2 rounds
		10 snatch 50kg
		10 Clean 50kg
		`

        const outputText = `2 rounds
		10 snatch 50kg
		10 Clean 50kg`

        const object = sectionTransformer.toObject(inputText)

        const expected: IBlock[] = [
            {
                config: { type: 'not_timed' },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed', numberOfRounds: 2 },
                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                            {
                                name: 'Clean',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
        ]

        expect(object).toMatchObject(expected)

        const converted = sectionTransformer.toString(object)

        expect(converted).eq(baseTransformer.normalizeText(outputText))
    })

    it('2 rounds header', () => {
        const inputText = `2 rounds
		10 snatch 50kg
		
		10 Clean 50kg
		`

        const outputText = `2 rounds
		10 snatch 50kg
		
		10 Clean 50kg`

        const object = sectionTransformer.toObject(inputText)

        const expected: IBlock[] = [
            {
                config: { type: 'not_timed' },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed', numberOfRounds: 2 },

                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                    {
                        config: { type: 'not_timed', numberOfRounds: 1 },

                        movements: [
                            {
                                name: 'Clean',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
        ]

        expect(object).toMatchObject(expected)

        const converted = sectionTransformer.toString(object)

        expect(converted).eq(baseTransformer.normalizeText(outputText))
    })

    it('3 rounds', () => {
        const inputText = `10 snatch 50kg

		2min rest
		
		10 Clean 50kg`

        const outpuText = `10 snatch 50kg

		2min Rest
		
		10 Clean 50kg`

        const object = sectionTransformer.toObject(inputText)

        const expected: IBlock[] = [
            {
                config: { type: 'not_timed' },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed', numberOfRounds: 1 },

                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                    {
                        type: 'rest',
                        time: 120,
                    },
                    {
                        config: { type: 'not_timed', numberOfRounds: 1 },

                        movements: [
                            {
                                name: 'Clean',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
        ]

        expect(object).toMatchObject(expected)

        const converted = sectionTransformer.toString(object)

        expect(converted).eq(baseTransformer.normalizeText(outpuText))
    })

    it('2 blocks', () => {
        const inputText = `10 snatch 50kg
		-
		2min rest
		`

        const outputText = `10 snatch 50kg
		-
		2min Rest`

        const object = sectionTransformer.toObject(inputText)

        const expected: IBlock[] = [
            {
                config: { type: 'not_timed' },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed', numberOfRounds: 1 },

                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                type: 'rest',
                time: 120,
            },
        ]

        expect(object).toMatchObject(expected)

        const converted = sectionTransformer.toString(object)

        expect(converted).eq(baseTransformer.normalizeText(outputText))
    })

    it('2 blocks with header', () => {
        const inputText = `
		bloco: amrap 30
		10 snatch 50kg
		-
		bloco: amrap 30s
		10 snatch 50kg
		`

        const outputText = `
		bloco: amrap 30s
		10 snatch 50kg
		-
		bloco: amrap 30s
		10 snatch 50kg
		`

        const object = sectionTransformer.toObject(inputText)

        const expected: IBlock[] = [
            {
                config: { type: 'amrap', numberOfRounds: 1, timecap: 30 },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed', numberOfRounds: 1 },
                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                config: { type: 'amrap', numberOfRounds: 1, timecap: 30 },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed', numberOfRounds: 1 },
                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
        ]

        expect(object).toMatchObject(expected)

        const converted = sectionTransformer.toString(object)

        expect(converted).eq(baseTransformer.normalizeText(outputText))
    })

    it('2 blocks with header and rounds with header', () => {
        const inputText = `
		bloco: amrap 30
		2 rounds
		10 snatch 50kg

		10cal Bike
		-
		bloco: amrap 30s
		10 snatch 50kg
		`

        const outputText = `
		bloco: amrap 30s
		2 rounds
		10 snatch 50kg

		10cal Bike
		-
		bloco: amrap 30s
		10 snatch 50kg
		`

        const object = sectionTransformer.toObject(inputText)

        const expected: IBlock[] = [
            {
                config: { type: 'amrap', numberOfRounds: 1, timecap: 30 },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed', numberOfRounds: 2 },
                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                    {
                        config: { type: 'not_timed', numberOfRounds: 1 },
                        movements: [
                            {
                                name: 'Bike',
                                reps: '10cal',
                            },
                        ],
                    },
                ],
            },
            {
                config: { type: 'amrap', numberOfRounds: 1, timecap: 30 },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed', numberOfRounds: 1 },
                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
        ]

        expect(object).toMatchObject(expected)

        const converted = sectionTransformer.toString(object)

        expect(converted).eq(baseTransformer.normalizeText(outputText))
    })

    it('2 blocks with 1 inputText block', () => {
        const inputText = `bloco: amrap 30
		2 rounds
		10 snatch 50kg
		-
		texto qualquer
		`
        const outputText = `bloco: amrap 30s
		2 rounds
		10 snatch 50kg
		-
		texto qualquer
		`

        const object = sectionTransformer.toObject(inputText)

        const expected: IBlock[] = [
            {
                config: { type: 'amrap', numberOfRounds: 1, timecap: 30 },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed', numberOfRounds: 2 },
                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                type: 'text',
                text: 'texto qualquer',
            },
        ]

        expect(object).toMatchObject(expected)

        const converted = sectionTransformer.toString(object)

        expect(converted).eq(baseTransformer.normalizeText(outputText))
    })

    it('2 rounds sequential', () => {
        const inputText = `1-2-3-4-5-6-7-8-9-10
		Burpee pull up
		Snatch

		pay out 500m run
		`
        const outputText = `1-2-3-4-5-6-7-8-9-10 rounds
		Burpee pull up
		Snatch
		
		pay out 500m run
		`

        const object = sectionTransformer.toObject(inputText)

        const expected: IBlock[] = [
            {
                config: { type: 'not_timed' },
                type: 'event',
                rounds: [
                    {
                        config: { type: 'not_timed', numberOfRounds: 10 },

                        movements: [
                            {
                                name: 'Burpee pull up',
                                reps: '1-2-3-4-5-6-7-8-9-10',
                            },
                            {
                                name: 'Snatch',
                                reps: '1-2-3-4-5-6-7-8-9-10',
                            },
                        ],
                    },
                    {
                        config: { type: 'not_timed', numberOfRounds: 1 },

                        movements: [
                            {
                                name: 'pay out 500m run',
                                reps: '',
                            },
                        ],
                    },
                ],
            },
        ]

        expect(object).toMatchObject(expected)

        const converted = sectionTransformer.toString(object)

        expect(converted).eq(baseTransformer.normalizeText(outputText))
    })
})
