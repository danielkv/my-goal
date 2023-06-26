import { getTimeFromSeconds } from '../time'
import { TMergedTimer, TTimerTypes } from 'goal-models'

export class BaseDisplay {
    protected displayRest(time: number): string {
        return `${getTimeFromSeconds(time)} Rest`
    }

    protected displayTimer(type: TTimerTypes, obj: TMergedTimer, sequence?: string | null): string | null {
        const rounds = this.displayArray(
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

                if (obj.numberOfRounds === 8 && obj.work === 20 && obj.rest === 10) return 'Tabata'

                return this.displayArray(['Tabata', rounds, timeString], ' ')
            }
            case 'emom': {
                if (!obj.each || !obj.numberOfRounds) return null

                const timeString = getTimeFromSeconds(obj.each)

                if (obj.each === 60) {
                    return this.displayArray(['EMOM', `${obj.numberOfRounds}min`], ' ')
                } else if (obj.each % 60 === 0 && obj.each < 600) {
                    const totalTimeMin = (obj.each * obj.numberOfRounds) / 60
                    return this.displayArray([`E${obj.each / 60}M`, `${totalTimeMin}min`], ' ')
                } else return this.displayArray(['EMOM', rounds, timeString], ' ')
            }

            case 'for_time':
            case 'amrap': {
                if (obj.timecap === undefined) return null

                const timeString = getTimeFromSeconds(obj.timecap)
                const typeString = type === 'for_time' ? 'For Time' : 'AMRAP'

                return this.displayArray([typeString, rounds, timeString], ' ')
            }
            default:
                return rounds
        }
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
