import { eventBlockDisplay } from './eventBlock'
import { IEventBlock } from 'goal-models'
import { describe, expect, it } from 'vitest'

describe('Event block displayHeader', () => {
    it('no header', () => {
        const outputText = ''

        const object: IEventBlock = {
            event_type: 'not_timed',
            type: 'event',
            numberOfRounds: 1,
            rounds: [
                {
                    type: 'not_timed',
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
        }

        const displayed = eventBlockDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "2 rounds"', () => {
        const outputText = '2 rounds'

        const object: IEventBlock = {
            event_type: 'not_timed',
            type: 'event',
            numberOfRounds: 2,
            rounds: [
                {
                    type: 'not_timed',
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
        }

        const displayed = eventBlockDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "(test info)"', () => {
        const outputText = '(teste info)'

        const object: IEventBlock = {
            event_type: 'not_timed',
            type: 'event',

            info: 'teste info',
            rounds: [
                {
                    type: 'not_timed',
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
        }

        const displayed = eventBlockDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "EMOM 4min"', () => {
        const outputText = 'EMOM 4min'

        const object: IEventBlock = {
            event_type: 'emom',
            type: 'event',
            each: 60,
            numberOfRounds: 4,
            rounds: [
                {
                    type: 'not_timed',
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
        }

        const displayed = eventBlockDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "For Time 2 rounds 1min40s"', () => {
        const outputText = 'For Time 2 rounds 1min40s'

        const object: IEventBlock = {
            event_type: 'for_time',
            type: 'event',
            timecap: 100,
            numberOfRounds: 2,
            rounds: [
                {
                    type: 'not_timed',
                    movements: [
                        {
                            name: 'Snatch',
                            reps: '10/8',
                            weight: {
                                type: 'kg',
                                value: '50',
                            },
                        },
                        {
                            name: 'Hang Snatch',
                            reps: '10',
                            weight: {
                                type: '%',
                                value: '50/40',
                            },
                        },
                    ],
                },
            ],
        }

        const displayed = eventBlockDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "3-2-1 rounds"', () => {
        const outputText = '3-2-1 rounds'

        const object: IEventBlock = {
            event_type: 'not_timed',
            type: 'event',
            rounds: [
                {
                    type: 'complex',
                    numberOfRounds: 3,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
                {
                    type: 'complex',
                    numberOfRounds: 2,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
                {
                    type: 'complex',
                    numberOfRounds: 1,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
            ],
        }

        const displayed = eventBlockDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "For Time 2-1 rounds"', () => {
        const outputText = 'For Time 2-1 rounds'

        const object: IEventBlock = {
            event_type: 'for_time',
            timecap: 0,
            numberOfRounds: 1,
            type: 'event',
            rounds: [
                {
                    type: 'complex',
                    numberOfRounds: 2,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
                {
                    type: 'complex',
                    numberOfRounds: 1,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
            ],
        }

        const displayed = eventBlockDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })

    it('header "For Time 10min"', () => {
        const outputText = 'For Time 10min'

        const object: IEventBlock = {
            event_type: 'for_time',
            timecap: 600,
            numberOfRounds: 1,
            type: 'event',
            rounds: [
                {
                    type: 'complex',
                    numberOfRounds: 1,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
            ],
        }

        const displayed = eventBlockDisplay.displayHeader(object)

        expect(displayed).eq(outputText)
    })
})
