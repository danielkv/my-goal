import dayjs from 'dayjs'
import { IWorksheetInput } from 'goal-models'
import {
    LabelTranslations,
    eventTypes,
    isBlock,
    isDay,
    isEventBlock,
    isPeriod,
    isRestBlock,
    isRound,
    isSection,
    isTextBlock,
} from 'goal-utils'

import { Path } from '@interfaces/app'
import { getCurrentPeace, getIndexes, getLastIndex, getPeaceFromPath } from '@utils/paths'

export function getCurrentForm(path: Path): [string, number, Record<string, number>] {
    let currentForm = getCurrentPeace(path)
    let lastIndex = getLastIndex(path)
    const indexMap = getIndexes(path)

    const result: [string, number, Record<string, number>] = [currentForm, lastIndex, indexMap]

    return result
}

export function getBreadcrumbLabel(worksheet: IWorksheetInput, path: Path): string {
    if (path === 'worksheet') return 'Planilha'

    const peace = getPeaceFromPath<Record<string, any>>(worksheet, path)
    const form = getCurrentPeace(path)
    const formIndex = getLastIndex(path)

    if (isDay(peace)) {
        const day = dayjs(peace.date, 'YYYY-MM-DD')
        return day.isValid() ? day.format('DD/MM/YYYY') : 'Sem data'
    }
    if (isPeriod(peace)) return `${String(formIndex + 1)}º Período `
    if (isSection(peace)) return peace.name || 'Seção'
    if (isBlock(peace)) {
        if (isEventBlock(peace)) return eventTypes[peace.config.type] || 'Evento'
        if (isTextBlock(peace)) return 'Texto'
        if (isRestBlock(peace)) return 'Rest'
    }
    if (isRound(peace)) return `Round ${String(formIndex + 1)}`

    return LabelTranslations[form] || form
}
