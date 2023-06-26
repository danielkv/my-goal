import dayjs from 'dayjs'

import { Path } from '@interfaces/app'
import { IWorksheet } from '@models/day'
import { isBlock, isDay, isEventBlock, isPeriod, isRestBlock, isRound, isSection, isTextBlock } from '@utils/models'
import { getCurrentPeace, getIndexes, getLastIndex, getPeaceFromPath } from '@utils/paths'
import { breadCrumbLabelMaps, eventTypes } from '@utils/worksheetInitials'

export function getCurrentForm(path: Path): [string, number, Record<string, number>] {
    let currentForm = getCurrentPeace(path)
    let lastIndex = getLastIndex(path)
    const indexMap = getIndexes(path)

    const result: [string, number, Record<string, number>] = [currentForm, lastIndex, indexMap]

    return result
}

export function getBreadcrumbLabel(worksheet: IWorksheet, path: Path): string {
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
        if (isEventBlock(peace)) return eventTypes[peace.event_type] || 'Evento'
        if (isTextBlock(peace)) return 'Texto'
        if (isRestBlock(peace)) return 'Rest'
    }
    if (isRound(peace)) return `Round ${String(formIndex + 1)}`

    return breadCrumbLabelMaps[form] || form
}
