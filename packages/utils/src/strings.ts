import chroma from 'chroma-js'

export function pluralize(number: number, word: string, plural: string = word + 's') {
    return [1, -1].includes(number) ? word : plural
}

export function capitalize(word: string) {
    return `${word.substring(0, 1).toLocaleUpperCase()}${word.substring(1)}`
}

export function stringToColor(string: string) {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff
        color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
}

export function userInitials(name?: string): string {
    if (!name) return '*_*'

    const splittedName = name.split(' ')

    if (splittedName.length === 1) return `${name[0]}${name[1]}`.toUpperCase()

    return `${splittedName[0]?.[0] || ''}${splittedName[1]?.[0] || ''}`.toUpperCase()
}

export function getContrastColor(color: string) {
    if (chroma.contrast(color, 'white') < 4) return '#000000'
    return '#ffffff'
}

export function displayArray(array: any[], separator = ' ', prefix = '', suffix = ''): string {
    const text = array.filter((part) => part).join(separator)

    if (!text) return ''

    return `${prefix}${text}${suffix}`
}
