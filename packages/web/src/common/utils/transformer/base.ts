import dayjs from 'dayjs'

import { IEMOMTimer, ITabataTimer, ITimecapTimer, TMergedTimer, TTimerTypes } from '@models/time'
import { getTimeFromSeconds } from '@utils/time'

import { numberHelper } from '../numbers'

import { RegexHelper } from './RegexHelper'

export class BaseTransformer extends RegexHelper {
    protected timeRegex = /^((?<t1>\d+)\s?(?<t1_type>m(?:in)?|s(?:ec)?)?(?:(?<t2>\d+)\s?s(?:ec)?)?)$/i

    protected numberRegex = /(?:(\d|\?)+(?:[\d\-\*\,\/\sa\?]*(?:\d|\?))?|max)/
    protected weightTypeRegex = /kg|%|lb/is

    protected repsTypeRegex = /x|m|km|s|mi|min|sec|cal/i
    protected timerTypeRegex = /emom|for time|amrap|tabata/i
    protected restRegex = this.mergeRegex([
        '^((?:(?:rest\\s)(?<time1>',
        this.timeRegex,
        '))|(?:(?<time2>',
        this.timeRegex,
        ')(?:\\s(?:rest))))',
    ])
    protected tabataTimeRegex = this.mergeRegex(['(?<work>', this.timeRegex, ')/(?<rest>', this.timeRegex, ')'])

    protected weightRegex = this.mergeRegex([
        '(?:((?<weight>',
        this.numberRegex,
        ')?)',
        '(?<weight_type>',
        this.weightTypeRegex,
        ')+)?',
    ])

    protected repsRegex = this.mergeRegex([
        '((?<reps_number>',
        /(?:\d+\º\s)?/,
        this.numberRegex,
        ')((?<reps_type>',
        this.repsTypeRegex,
        ')?)+)',
    ])

    protected movementBaseRegex = this.mergeRegex(['^(?<reps>', this.repsRegex, '\\s+)?(?<name>.+)$'])

    protected weightBaseRegex = this.mergeRegex(['^(?<movement>.+)\\s+(?<weight>', this.weightRegex, ')$'])

    // emom 2 rounds 1min
    protected timerEmomRegex = this.mergeRegex(
        ['^emom(?:\\s(?<numberOfRounds>\\d+)(?:\\srounds?|x)?)?', '(?:\\s', '(?<time>', this.timeRegex, ')', ')'],
        'i'
    )
    // E3M 15min
    protected timerEmomEachRegex = this.mergeRegex(
        ['^e(?<each>\\d+)m', '(?:\\s*?', '(?<time>', this.timeRegex, ')', ')'],
        'i'
    )

    // tabata 2 rounds 20s/10s
    protected timerTabataRegex = this.mergeRegex(
        ['^tabata(?:\\s(?<numberOfRounds>\\d+)(?:\\srounds?|x)?)?', '(?:\\s', '(?<time>', this.tabataTimeRegex, '))?'],
        'i'
    )

    // 2 rounds amrap 3min
    protected timerAmrapRegex = this.mergeRegex(
        ['^amrap\\s+', '(?:(?<numberOfRounds>\\d+)(?:\\s*?rounds?|x)?\\s+)?', '(?<time>', this.timeRegex, ')?'],
        'i'
    )

    // 2 rounds for time 3min
    protected timerFortimeRegex = this.mergeRegex(
        [
            '^(?:for(?:\\s|-)?time)',
            '(?:\\s',
            '(?<numberOfRounds>',
            this.numberRegex,
            '+)(?:\\srounds?|x)?)?',
            '(?<time>\\s',
            this.timeRegex,
            ')?$',
        ],
        'i'
    )

    protected timerGenericRegex = this.mergeRegex(
        [
            '^(?:(?<numberOfRounds>',
            this.numberRegex,
            '+)(?:\\srounds?|x)?)?',
            '(?:\\s+',
            '(?<time>',
            this.timeRegex,
            ')',
            ')?$',
        ],
        'i'
    )

    protected headerRegex = this.mergeRegex([
        '^(?:(?:(?<number>',
        this.numberRegex,
        ')(?:x|\\s+rounds?)?)|',
        '(?<emom>',
        this.timerEmomRegex,
        ')|',
        '(?<emomEach>',
        this.timerEmomEachRegex,
        ')|',
        '(?<tabata>',
        this.timerTabataRegex,
        ')|',
        '(?<amrap>',
        this.timerAmrapRegex,
        ')|',
        '(?<fortime>',
        this.timerFortimeRegex,
        ')|',
        '(?<generic>',
        this.timerGenericRegex,
        '))$',
    ])

    normalizeText(text: string): string {
        return text.replaceAll(/\t/g, '').trim()
    }

    protected extractTimerFromString(text: string): (TMergedTimer & { reps?: string }) | null {
        const match = text.match(this.headerRegex)

        if (!match?.groups) return null
        if (match.groups.emom) {
            const result = this.extractEmomTimerFromString(match.groups.emom)
            if (result) return result
        } else if (match.groups.emomEach) {
            const result = this.extractEmomEachTimerFromString(match.groups.emomEach)
            if (result) return result
        } else if (match.groups.tabata) {
            const result = this.extractTabataTimerFromString(match.groups.tabata)
            if (result) return result
        } else if (match.groups.amrap) {
            const result = this.extractAmrapTimerFromString(match.groups.amrap)
            if (result) return result
        } else if (match.groups.fortime) {
            const result = this.extractFortimeTimerFromString(match.groups.fortime)
            if (result) return result
        } else if (match.groups.generic) {
            const result = this.extractGenericTimerFromString(match.groups.generic)
            if (result) return result
        } else if (match.groups.number) {
            const result = this.extractNumberHeaderFromString(match.groups.number)
            if (result) return result
        }

        return {
            type: 'not_timed',
            numberOfRounds: 1,
        }
    }

    private extractRounds(roundsText?: string, defaultValue = 1) {
        if (!roundsText) return { numberOfRounds: defaultValue }
        if (!Number.isNaN(Number(roundsText))) return { numberOfRounds: Number(roundsText) }

        const match = roundsText.match(numberHelper.sequenceRegex)
        if (!match) return { numberOfRounds: defaultValue }

        const reps = roundsText.trim()

        return { numberOfRounds: reps.split('-').length, reps }
    }

    protected extractNumberHeaderFromString(text: string): { type: 'not_timed'; reps?: string } | null {
        const numberOfRoundsObj = this.extractRounds(text)

        return {
            type: 'not_timed',
            ...numberOfRoundsObj,
        }
    }

    protected extractFortimeTimerFromString(
        text: string
    ): (ITimecapTimer & { type: 'for_time'; reps?: string }) | null {
        const matchSpecific = text.match(this.timerFortimeRegex)

        if (!matchSpecific?.groups) return null
        const numberOfRoundsObj = this.extractRounds(matchSpecific?.groups?.numberOfRounds)

        if (matchSpecific?.groups?.time) {
            const timecap = this.extractTimeByType('for_time', matchSpecific.groups.time.trim())

            return {
                type: 'for_time',
                timecap,
                ...numberOfRoundsObj,
            }
        } else {
            return {
                type: 'for_time',
                timecap: 0,
                ...numberOfRoundsObj,
            }
        }
    }

    protected extractGenericTimerFromString(
        text: string
    ): (ITimecapTimer & { type: 'for_time'; reps?: string }) | null {
        const matchSpecific = text.match(this.timerGenericRegex)

        if (!matchSpecific?.groups) return null
        const numberOfRoundsObj = this.extractRounds(matchSpecific?.groups?.numberOfRounds)

        if (matchSpecific?.groups?.time) {
            const timecap = this.extractTimeByType('for_time', matchSpecific.groups.time.trim())

            return {
                type: 'for_time',
                timecap,
                ...numberOfRoundsObj,
            }
        } else {
            return {
                type: 'for_time',
                timecap: 0,
                ...numberOfRoundsObj,
            }
        }
    }

    protected extractAmrapTimerFromString(text: string): (ITimecapTimer & { type: 'amrap'; reps?: string }) | null {
        const matchSpecific = text.match(this.timerAmrapRegex)
        if (!matchSpecific?.groups) return null
        const numberOfRoundsObj = this.extractRounds(matchSpecific?.groups?.numberOfRounds)

        if (matchSpecific?.groups?.time) {
            const timecap = this.extractTimeByType('amrap', matchSpecific.groups.time.trim())

            return {
                type: 'amrap',
                timecap,
                ...numberOfRoundsObj,
            }
        }

        return null
    }

    protected extractTabataTimerFromString(text: string): (ITabataTimer & { type: 'tabata'; reps?: string }) | null {
        const matchSpecific = text.match(this.timerTabataRegex)
        if (!matchSpecific?.groups) return null

        const numberOfRoundsObj = this.extractRounds(matchSpecific?.groups?.numberOfRounds, 8)

        if (matchSpecific?.groups?.time) {
            const [work, rest] = this.extractTimeByType('tabata', matchSpecific.groups.time.trim())

            return {
                type: 'tabata',
                work,
                rest,
                ...numberOfRoundsObj,
            }
        } else {
            return {
                type: 'tabata',
                work: 20,
                rest: 10,
                ...numberOfRoundsObj,
            }
        }
    }

    protected extractEmomTimerFromString(text: string): (IEMOMTimer & { type: 'emom'; reps?: string }) | null {
        const matchSpecific = text.match(this.timerEmomRegex)
        if (!matchSpecific?.groups) return null

        if (matchSpecific?.groups?.time) {
            const time = this.extractTimeByType('emom', matchSpecific.groups.time.trim())

            if (matchSpecific.groups.numberOfRounds) {
                const numberOfRoundsObj = this.extractRounds(matchSpecific.groups.numberOfRounds)

                return {
                    type: 'emom',
                    each: time,
                    ...numberOfRoundsObj,
                }
            } else {
                if (time % 60 === 0)
                    return {
                        type: 'emom',
                        numberOfRounds: time / 60,
                        each: 60,
                    }
            }
        }

        return null
    }

    protected extractEmomEachTimerFromString(text: string): (IEMOMTimer & { type: 'emom'; reps?: string }) | null {
        const matchSpecific = text.match(this.timerEmomEachRegex)

        if (!matchSpecific?.groups?.time || !matchSpecific?.groups?.each)
            throw new Error(`${text}: O tempo ou o tipo de WOD está errado`)

        const totalTime = this.extractTimeByType('emom', matchSpecific.groups.time.trim())

        const each = Number(matchSpecific.groups.each) * 60
        if (totalTime % each !== 0) throw new Error(`${text}: O tempo do emom é incompatível`)

        const numberOfRounds = totalTime / each

        return {
            type: 'emom',
            each,
            numberOfRounds,
        }
    }

    protected extractTimeByType(type: Extract<TTimerTypes, 'tabata'>, time: string): [number, number]
    protected extractTimeByType(type: Exclude<TTimerTypes, 'tabata'>, time: string): number
    protected extractTimeByType(type: TTimerTypes, time: string): number | [number, number] {
        if (!time) return 0

        if (type === 'tabata') {
            const match = time.match(this.tabataTimeRegex)
            if (!match?.groups) return 0

            const work = this.extractTime(match.groups.work)
            const rest = this.extractTime(match.groups.rest)

            return [work, rest]
        }

        return this.extractTime(time)
    }

    protected extractTime(time: string): number {
        const match = time.match(this.timeRegex)
        if (!match?.groups) return 0

        const minutes =
            match.groups.t1_type && ['m', 'min'].includes(match.groups.t1_type) ? Number(match.groups.t1) : undefined
        const seconds =
            ['s', 'sec'].includes(match.groups.t1_type) || !match.groups.t1_type
                ? Number(match.groups.t1)
                : Number(match.groups.t2) || undefined

        return dayjs.duration({ minutes, seconds }).asSeconds()
    }

    protected findRest(text: string): number | null {
        const match = text.match(this.restRegex)
        if (!match?.groups?.time1 && !match?.groups?.time2) return null

        return this.extractTime(match?.groups.time1 || match?.groups.time2)
    }

    protected timerToString(type: TTimerTypes, obj: TMergedTimer, sequence?: string | null): string | null {
        const rounds = this.arrayToString(
            [sequence || (obj.numberOfRounds && obj.numberOfRounds > 1 ? obj.numberOfRounds : null)],
            '',
            '',
            ' rounds'
        )

        switch (type) {
            case 'tabata': {
                if (!obj.work || !obj.rest) return null
                const work = getTimeFromSeconds(obj.work)
                const rest = getTimeFromSeconds(obj.rest)
                const timeString = `${work}/${rest}`

                if (obj.numberOfRounds === 8 && obj.work === 20 && obj.rest === 10) return 'tabata'

                return this.arrayToString(['tabata', rounds, timeString], ' ')
            }
            case 'emom': {
                if (!obj.each || !obj.numberOfRounds) return null

                const timeString = getTimeFromSeconds(obj.each)

                if (obj.each === 60) {
                    return this.arrayToString(['emom', `${obj.numberOfRounds}min`], ' ')
                } else if (obj.each % 60 === 0 && obj.each < 600) {
                    const totalTimeMin = (obj.each * obj.numberOfRounds) / 60
                    return this.arrayToString([`E${obj.each / 60}M`, `${totalTimeMin}min`], ' ')
                } else return this.arrayToString(['emom', rounds, timeString], ' ')
            }

            case 'for_time':
            case 'amrap': {
                if (obj.timecap === undefined) return null

                const timeString = getTimeFromSeconds(obj.timecap)
                const typeString = type === 'for_time' ? 'for time' : 'amrap'

                return this.arrayToString([typeString, rounds, timeString], ' ')
            }
            default:
                return rounds
        }
    }

    protected roundsToString(rounds?: number, suffix = 'rounds', prefix?: string): string {
        if (!rounds) return ''
        if (rounds <= 1) return ''
        return this.arrayToString([prefix, rounds, suffix])
    }

    arrayToString(array: any[], separator = ' ', prefix = '', suffix = ''): string {
        const text = array.filter((part) => part).join(separator)

        if (!text) return ''

        return `${prefix}${text}${suffix}`
    }
}
