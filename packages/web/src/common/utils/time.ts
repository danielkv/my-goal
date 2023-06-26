import dayjs from 'dayjs'
import { isNumber } from 'radash'

export function getTimeFromSeconds(seconds: number): string {
    if (!seconds) return ''
    const t = dayjs.duration(seconds, 'seconds')

    if (seconds < 60) return `${seconds}s`

    if (seconds % 60 == 0) return `${t.format('m[min]')}`

    return t.format('m[min]ss[s]')
}

export function stringTimeToSeconds(string: string): number {
    const splited = string.split(':')
    const minutes = Number(splited[0])
    const seconds = Number(splited[1])

    if (!isNumber(minutes) || !isNumber(seconds)) return 0

    const duration = dayjs.duration({ minutes, seconds })

    return duration.asSeconds()
}

export function secondsToStringTime(time: number): string {
    const duration = dayjs.duration(time, 'seconds')

    return duration.format('mm:ss')
}
