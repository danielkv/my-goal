export function pluralize(number: number, word: string, plural: string = word + 's') {
    return [1, -1].includes(number) ? word : plural
}
