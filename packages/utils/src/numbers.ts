import { IEventMovement } from 'goal-models'

type TOpts = {
    suffix: string
    separator: string
}

class NumberHelper {
    public readonly calcRegexRegex = /^([\d\,]+)(\-|\+)([\d\,]+)\*([\d]+)$/
    public readonly endingRegex = /(?<ending>x|m|km|s|mi|min|sec|kg|%|lb|cal)$/
    public readonly rangeRegex = /^([\d\,]+) a ([\d\,]+)$/
    public readonly sequenceRegex = /(?:\d+(\,\d+)?)(?:\/\d+(\,\d+)?)?/g

    private getOpts(opts?: Partial<TOpts>): TOpts {
        return { suffix: 'Rounds', separator: '-', ...opts }
    }

    private clearNumber(number: string, ending?: string | null) {
        if (ending) return number.trim().replaceAll(ending, '')

        return number.trim()
    }

    public getEnding(number: string): string | null {
        const match = number.trim().match(this.endingRegex)

        return match?.groups?.ending || null
    }

    public convertCalcMatch(number: string, opts?: Partial<TOpts>): string | null {
        const calcMatch = number.match(this.calcRegexRegex)
        if (!calcMatch) return null

        const calculatedOpts = this.getOpts(opts)

        const n1 = Number(calcMatch[1].replace(',', '.'))
        const n2 = calcMatch[2]
        const n3 = Number(calcMatch[3].replace(',', '.'))
        const n4 = Number(calcMatch[4].replace(',', '.'))

        let numbers: number[]

        if (n2 === '-') {
            numbers = Array.from({ length: n4 }).map((_, index) => n1 - index * n3)
        } else {
            numbers = Array.from({ length: n4 }).map((_, index) => n1 + index * n3)
        }

        return numbers.join(calculatedOpts.separator)
    }

    public convertRangeMatch(number: string, opts?: Partial<TOpts>): string | null {
        const rangeMatch = number.match(this.rangeRegex)
        if (!rangeMatch) return null

        const n1 = Number(rangeMatch[1].replace(',', '.'))
        const n2 = Number(rangeMatch[2].replace(',', '.'))

        return `${n1} a ${n2}`
    }

    public convertSequenceMatch(number: string, opts?: Partial<TOpts>): string | null {
        const sequenceMatch = number.match(this.sequenceRegex)
        if (!sequenceMatch) return null

        const calculatedOpts = this.getOpts(opts)

        return number.replace(/([^\d^\,^\?^\/]+)/g, calculatedOpts.separator)
    }

    public convertNumbers(number?: string, opts?: Partial<TOpts>): string {
        if (!number) return ''
        if (number === 'max') return 'max'

        const calculatedOpts = this.getOpts(opts)

        const ending = this.getEnding(number)
        const _number = this.clearNumber(number, ending)

        if (!Number.isNaN(Number(_number))) return `${_number}${ending || ''}${calculatedOpts.suffix}`

        const calcMatch = this.convertCalcMatch(_number, opts)
        if (calcMatch) return this.addSuffix(calcMatch, ending || calculatedOpts.suffix)

        const rangeMatch = this.convertRangeMatch(_number, opts)
        if (rangeMatch) return this.addSuffix(rangeMatch, ending || calculatedOpts.suffix)

        const sequenceMatch = this.convertSequenceMatch(_number, opts)
        if (sequenceMatch) return this.addSuffix(sequenceMatch, ending || calculatedOpts.suffix)

        return _number
    }

    private addSuffix(numberResult: string, suffix?: string) {
        return `${numberResult}${suffix}`
    }

    findSequenceReps(movements: IEventMovement[]): string | null {
        const compareReps = movements[0]?.reps
        if (!compareReps) return null

        if (!compareReps.includes('-')) return null

        const match = compareReps.match(this.sequenceRegex)
        if (!match) return null

        if (movements.length === 1) return compareReps

        if (!movements.every((movement) => movement.reps === compareReps)) return null

        return compareReps
    }
}

export const numberHelper = new NumberHelper()
