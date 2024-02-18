import { IWorksheetInput } from 'goal-models'
import { get, isNumber, set } from 'radash'

import { NestedKeyOf, Path } from '@interfaces/app'

export function getPeaceFromPath<T>(object: IWorksheetInput, path: Path, until?: string): T {
    let normalizedPath = path.replace(/worksheet.?/, '')

    if (until) {
        normalizedPath = splicePath(path, until)
    }
    const result = get<IWorksheetInput, T>(object, normalizedPath)

    return result as T
}

export function setPeaceFromPath<T>(current: IWorksheetInput, path: Path, newValue: T): IWorksheetInput {
    const normalizedPath = path.replace(/worksheet.?/, '')

    const result = set(current, normalizedPath, newValue)

    return result
}

export function splicePath(path: Path, until: string): Path {
    return path.slice(0, path.search(until) + until.length - 1) as Path
}

export function addToPath<T extends object | string>(
    initialPath: Path,
    path: T extends object ? NestedKeyOf<T> : T
): Path {
    return `${initialPath}.${path}` as Path
}

export function pathToParent(path: Path, count = 1): Path {
    const arrayPath = path.split('.')

    return arrayPath.slice(0, arrayPath.length - count).join('.') as Path
}

export function pathToNextIndex(path: Path, count = 1): Path {
    const newIndex = getLastIndex(path) + count

    const listPath = pathToParent(path)

    const finalPath = addToPath(listPath, `${newIndex}`)

    return finalPath
}

export function pathToPreviousIndex(path: Path, count = 1): Path {
    const newIndex = getLastIndex(path) - count

    const listPath = pathToParent(path)

    const finalPath = addToPath(listPath, `${newIndex}`)

    return finalPath
}

export function findNextIndexPath(current: IWorksheetInput, path: Path): Path | null {
    const currentIndex = getLastIndex(path)
    if (currentIndex === -1) return null

    const currentList = getPeaceFromPath<object[]>(current, pathToParent(path))

    if (currentIndex >= currentList.length - 1) {
        const currentPeace = getCurrentPeace(path)
        const parentPath = pathToParent(path, 2)
        const nextPreviousPath = findNextIndexPath(current, parentPath)
        if (nextPreviousPath === null) return null

        const listPath = addToPath(nextPreviousPath, `${currentPeace}`)
        const list = getPeaceFromPath<object[]>(current, listPath)
        if (!list) return null

        return addToPath(nextPreviousPath, `${currentPeace}.0`)
    }

    return pathToNextIndex(path, 1)
}

export function findPreviousIndexPath(current: IWorksheetInput, path: Path, root = true): Path | null {
    const currentIndex = getLastIndex(path)
    if (currentIndex === -1) return null

    if (currentIndex === 0) {
        const currentPeace = getCurrentPeace(path)
        const parentPath = pathToParent(path, 2)

        const previousIndexPath = findPreviousIndexPath(current, parentPath, false)
        if (!previousIndexPath) return null

        const listPath = addToPath(previousIndexPath, `${currentPeace}`)
        const list = getPeaceFromPath<object[]>(current, listPath)
        if (!list) return null

        const index = root ? list.length : list.length - 1

        const result = addToPath(listPath, `${index}`)

        return result
    }

    return pathToPreviousIndex(path, 1)
}

export function getLastIndex(path: Path): number {
    const arrayPath = path.split('.')
    const lastIndex = arrayPath.reverse().find((ele) => {
        if (isNumber(Number(ele))) return true
    })
    return lastIndex ? Number(lastIndex) : -1
}

export function getCurrentPeace(path: Path): string {
    const arrayPath = path.split('.').reverse()

    let current = ''
    let i = 0
    do {
        current = arrayPath[i]
        i++
    } while (isNumber(Number(current)))

    return current
}

export function extractPaths(path: Path) {
    const regex = /([\w\-]+)/gm
    const paths = [...path.matchAll(regex)].map((item) => (!Number.isNaN(Number(item[0])) ? Number(item[0]) : item[0]))

    return paths
}

export function getIndexes(path: Path): Record<string, number> {
    const extractedPaths = extractPaths(path)

    return extractedPaths.reduce<Record<string, number>>((acc, element, idx) => {
        if (isNumber(element)) return acc
        if (!['days', 'periods', 'sections', 'blocks', 'rounds'].includes(element)) return acc

        const arrayIndex = extractedPaths[idx + 1]
        if (arrayIndex !== undefined && isNumber(arrayIndex)) acc[element] = arrayIndex

        return acc
    }, {})
}

export function buildPathSequence(path: Path) {
    const paths = extractPaths(path)

    return paths.reduce<Path[]>((acc, item, index) => {
        const curr = paths.slice(0, index + 1).join('.')

        if (isNumber(item)) {
            const nextIndex = acc.length - 1

            acc[nextIndex] = `${acc[nextIndex]}.${item}` as Path
        } else acc.push(curr as Path)

        return acc
    }, [])
}
