import { TTimerTypes } from '@models/time'
import { pluralize } from '@utils/strings'
import { getTimeFromSeconds } from '@utils/time'

import dayjs from 'dayjs'

import { RegexHelper } from './RegexHelper'

export abstract class BaseTransformer extends RegexHelper {
    protected timeRegex = /^((?<t1>\d+)\s?(?<t1_type>m(?:in)?|s(?:ec)?)(?:(?<t2>\d+)\s?s(?:ec)?)?)$/i

    protected numberRegex = /(\d|\?)+(?:[\d\-\*\,\/\sa\?]*(?:\d|\?))?/
    protected movementNameRegex = /[a-zA-Z\u00C0-\u00FF\s\'\d+\(\)]+[A-Z\)]/
    protected weightTypeRegex = /kg|%|lb/i

    protected weightRegex = this.mergeRegex([
        '(?:\\s\\-\\s((?<weight>',
        this.numberRegex,
        ')?)',
        '(?<weight_type>',
        this.weightTypeRegex,
        ')+)?',
    ])

    protected repsTypeRegex = /x|m|km|s|mi|min|sec/i
    protected timerTypeRegex = /emom|for time|amrap|tabata/i
    protected restRegex = this.mergeRegex([
        '^((?:(?:rest\\s)(?<time1>',
        this.timeRegex,
        '))|(?:(?<time2>',
        this.timeRegex,
        ')(?:\\s(?:rest))))',
    ])
    protected tabataTimeRegex = this.mergeRegex(['(?<work>', this.timeRegex, ')/(?<rest>', this.timeRegex, ')'])

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

        const minutes = ['m', 'min'].includes(match.groups.t1_type) ? Number(match.groups.t1) : undefined
        const seconds = ['s', 'sec'].includes(match.groups.t1_type)
            ? Number(match.groups.t1)
            : Number(match.groups.t2) || undefined

        return dayjs.duration({ minutes, seconds }).asSeconds()
    }

    protected findRest(text: string): number | null {
        const match = text.match(this.restRegex)
        if (!match?.groups?.time1 && !match?.groups?.time2) return null

        return this.extractTime(match?.groups.time1 || match?.groups.time2)
    }

    protected displayRest(time: number): string {
        return `${getTimeFromSeconds(time)} Rest`
    }

    protected timerToString(type: 'emom', each: number): string
    protected timerToString(type: 'tabata', work: number, rest: number): string
    protected timerToString(type: 'for_time' | 'amrap', timecap: number): string
    protected timerToString(type: 'not_timed'): null
    protected timerToString(type: TTimerTypes, t1?: number | never, t2?: never | number): string | null {
        switch (type) {
            case 'tabata': {
                if (!t1 || !t2) return null
                const work = getTimeFromSeconds(t1)
                const rest = getTimeFromSeconds(t2)
                return `${work}/${rest}`
            }
            case 'emom':
            case 'for_time':
            case 'amrap': {
                if (!t1) return null
                const time = getTimeFromSeconds(t1)
                return time
            }
            default:
                return null
        }
    }

    protected displayTimer(type: 'emom', rounds: number, each: number): string
    protected displayTimer(type: 'tabata', rounds: number, work: number, rest: number): string
    protected displayTimer(type: 'for_time' | 'amrap', rounds: number, timecap: number): string
    protected displayTimer(type: 'not_timed'): null
    protected displayTimer(
        type: TTimerTypes,
        rounds?: number | never,
        t1?: number | never,
        t2?: never | number
    ): string | null {
        if (!rounds) return null

        if (type === 'emom') {
            if (!t1) return null
            const each = getTimeFromSeconds(t1)
            return `Cada ${each} por ${rounds} ${pluralize(rounds, 'round')}`
        }

        if (type === 'tabata') {
            if (!t1 || !t2) return null
            const work = getTimeFromSeconds(t1)
            const rest = getTimeFromSeconds(t2)
            return `${work}/${rest} por ${rounds} ${pluralize(rounds, 'round')}`
        }

        if (t1 === undefined) return null

        const timecap = t1 === 0 ? '' : getTimeFromSeconds(t1)
        const roundsDisplay = rounds > 1 ? this.displayNumberOfRounds(rounds) : ''

        return this.displayArray([timecap.trim(), roundsDisplay.trim()], ' - ')
    }

    protected displayShortTimer(type: 'emom', rounds: number, each: number): string
    protected displayShortTimer(type: 'tabata', rounds: number, work: number, rest: number): string
    protected displayShortTimer(type: 'for_time' | 'amrap', rounds: number, timecap: number): string
    protected displayShortTimer(type: 'not_timed'): null
    protected displayShortTimer(
        type: TTimerTypes,
        rounds?: number | never,
        t1?: number | never,
        t2?: never | number
    ): string | null {
        if (!rounds) return null

        if (type === 'emom') {
            if (!t1) return null
            const each = getTimeFromSeconds(t1)
            return `${rounds}x ${each}`
        }

        if (type === 'tabata') {
            if (!t1 || !t2) return null
            const work = getTimeFromSeconds(t1)
            const rest = getTimeFromSeconds(t2)
            return `${rounds}x ${work}/${rest}`
        }

        if (t1 === undefined) return null

        const timecap = t1 === 0 ? '' : getTimeFromSeconds(t1)

        return this.displayArray([timecap.trim()])
    }

    protected displayNumberOfRounds(rounds?: number, suffix = 'rounds', prefix?: string): string {
        if (!rounds) return ''
        if (rounds <= 1) return ''
        return this.displayArray([prefix, rounds, suffix])
    }

    displayArray(array: any[], separator = ' ', prefix = '', suffix = ''): string {
        const text = array.filter((part) => part).join(separator)

        if (!text) return ''

        return `${prefix}${text}${suffix}`
    }
}
