import { unique } from 'radash'

export class RegexHelper {
    private groupNamesRegex = /\?\<[A-Za-z0-9\_\-]+\>/gi
    private removeRegex = /^\^|\$$/gi

    mergeRegex(regex: (RegExp | string)[], flags?: string): RegExp {
        const filteredRegExp = this.filterOnlyRegex(regex)

        const concatSource = this.concatSource(regex)
        const concateFlags = flags || this.concatFlags(filteredRegExp)

        return new RegExp(concatSource, concateFlags)
    }

    private filterOnlyRegex(regex: (RegExp | string)[]): RegExp[] {
        return regex.filter((r) => typeof regex !== 'string') as RegExp[]
    }

    private removeGroupNames(regexStr: string): string {
        return regexStr.replaceAll(this.groupNamesRegex, '').replaceAll(this.removeRegex, '')
    }

    private concatSource(regex: (RegExp | string)[]): string {
        return regex.reduce<string>((acc, item) => {
            if (typeof item === 'string') return `${acc}${item}`

            const source = this.removeGroupNames(item.source)

            return `${acc}${source}`
        }, '')
    }

    private concatFlags(regex: RegExp[]): string {
        const flags = regex.reduce<string[]>((acc, item) => {
            if (typeof item === 'string') return acc

            const source = item.flags.split('')
            return acc.concat(source)
        }, [])

        return unique(flags, (f) => f).join('')
    }
}
