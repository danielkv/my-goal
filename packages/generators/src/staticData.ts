import { ISection } from 'goal-models'

export const sections: ISection[] = [
    {
        blocks: [
            {
                text: 'Mobildade',
                type: 'text',
            },
            {
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
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '3min',
                                name: 'Row',
                            },
                        ],
                        config: {
                            type: 'not_timed',
                        },
                    },
                ],
            },
        ],
        name: 'Aquecimento',
    },
    {
        blocks: [
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '',
                                name: 'buy in 500m row',
                            },
                        ],
                        config: {
                            type: 'not_timed',
                        },
                    },
                    {
                        movements: [
                            {
                                reps: '10',
                                name: 'Pull up',
                            },
                            {
                                reps: '20',
                                name: 'push up',
                            },
                            {
                                reps: '30',
                                name: 'air squat',
                            },
                        ],
                        config: {
                            type: 'not_timed',
                            numberOfRounds: 3,
                        },
                    },
                    {
                        movements: [
                            {
                                reps: '',
                                name: 'pay out 500m row',
                            },
                        ],
                        config: {
                            type: 'not_timed',
                        },
                    },
                ],
            },
        ],
        name: 'WOD',
    },
    {
        blocks: [
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '',
                                name: 'Mobilidade',
                            },
                        ],
                        config: {
                            type: 'not_timed',
                        },
                    },
                    {
                        movements: [
                            {
                                reps: '10',
                                name: 'Stiff Bom dia',
                            },
                            {
                                reps: '10',
                                name: 'Back Squat',
                            },
                            {
                                reps: '10',
                                name: 'Canoas',
                            },
                        ],
                        config: {
                            type: 'not_timed',
                            numberOfRounds: 2,
                        },
                    },
                ],
            },
        ],
        name: 'Aquecimento',
    },
    {
        blocks: [
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '3',
                                name: 'back squat',
                                weight: {
                                    type: '%',
                                    value: '50',
                                },
                            },
                            {
                                reps: '3',
                                name: 'Deadlift',
                                weight: {
                                    type: '%',
                                    value: '50',
                                },
                            },
                            {
                                reps: '5',
                                name: 'Strict Pull Up',
                            },
                        ],
                        config: {
                            type: 'not_timed',
                            numberOfRounds: 5,
                        },
                    },
                ],
            },
        ],
        name: 'Wod 1',
    },
    {
        blocks: [
            {
                text: 'Muita Mobilidade',
                type: 'text',
            },
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '500m',
                                name: 'run',
                            },
                        ],
                        config: {
                            type: 'not_timed',
                        },
                    },
                ],
            },
        ],
        name: 'Aquecimento',
    },
    {
        blocks: [
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                    numberOfRounds: 8,
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '1',
                                name: 'RMU/BMU',
                            },
                            {
                                reps: '2',
                                name: 'Devil Press',
                                weight: {
                                    type: 'kg',
                                    value: '15/22,5',
                                },
                            },
                            {
                                reps: '300m',
                                name: 'run',
                            },
                        ],
                        config: {
                            type: 'not_timed',
                        },
                    },
                ],
            },
        ],
        name: 'WOD',
    },
    {
        blocks: [
            {
                text: 'Mobildade',
                type: 'text',
            },
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '12',
                                name: 'Rotator cuff com shoulder press com miniband',
                            },
                            {
                                reps: '15',
                                name: 'passadas com air squat com miniband (vai 1 vota 1 e mais 1 air squat)',
                            },
                            {
                                reps: '15',
                                name: 'canoas',
                            },
                            {
                                reps: '10',
                                name: 'Back extension no GHD (focar em posterior e gluteo)',
                            },
                        ],

                        config: {
                            type: 'not_timed',
                            numberOfRounds: 2,
                        },
                    },
                ],
            },
        ],
        name: 'Aquecimento',
    },
    {
        blocks: [
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '4-4-4-3-3-3',
                                name: 'Back squat 55 a',
                                weight: {
                                    type: '%',
                                    value: '80',
                                },
                            },
                        ],

                        config: {
                            type: 'not_timed',
                            numberOfRounds: 6,
                        },
                    },
                ],
            },
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '5-5-5-5',
                                name: 'Clean Pull',
                                weight: {
                                    type: '%',
                                    value: '70-75-75-80',
                                },
                            },
                        ],

                        config: {
                            type: 'not_timed',
                            numberOfRounds: 4,
                        },
                    },
                ],
            },
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '4-4-4-3-3-3',
                                name: 'Push Press (peso referente a push press) 55 a',
                                weight: {
                                    type: '%',
                                    value: '75',
                                },
                            },
                        ],

                        config: {
                            type: 'not_timed',
                            numberOfRounds: 6,
                        },
                    },
                ],
            },
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                name: 'L-sit leg less rope climbe, descida em leg less, ou L-Pul Up',
                                reps: '1',
                            },
                        ],
                        config: {
                            type: 'not_timed',
                            numberOfRounds: 5,
                        },
                    },
                ],
            },
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '8',
                                name: 'Strict T2B saindo com pés da caixa',
                            },
                        ],

                        config: {
                            type: 'emom',
                            each: 60,
                            numberOfRounds: 5,
                        },
                    },
                ],
            },
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '8/8',
                                name: 'Reverse Lunge de cima da anilha de 20 KG 20/14kg subida rapida e explosiva',
                            },
                            {
                                reps: '16',
                                videoUrl: 'https://www.youtube.com/watch?v=XE9Teo6ZMxI',
                                name: 'Push Up alterned Plate',
                                weight: {
                                    type: 'kg',
                                    value: '10/15',
                                },
                            },
                            {
                                reps: '10',
                                videoUrl: 'https://www.youtube.com/watch?v=ilv8ktxMI7Q',
                                name: 'DB row back extension GHD',
                            },
                        ],

                        config: {
                            type: 'not_timed',
                            numberOfRounds: 2,
                        },
                    },
                ],
            },
            {
                type: 'event',
                config: {
                    type: 'not_timed',
                },
                rounds: [
                    {
                        movements: [
                            {
                                reps: '30',
                                name: 'Flexao plantar com Peso',
                            },
                            {
                                reps: '10',
                                name: 'Rosca direta',
                            },
                            {
                                reps: '12',
                                name: 'Triceps Testa',
                            },
                        ],

                        config: {
                            type: 'not_timed',
                            numberOfRounds: 2,
                        },
                    },
                ],
            },
        ],
        name: 'Força',
    },
]
