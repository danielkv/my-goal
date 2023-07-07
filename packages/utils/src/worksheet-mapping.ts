import { TTimerTypes } from 'goal-models'

export const LabelTranslations: Record<string, string> = {
    worksheet: 'Planilha',
    periods: 'Período',
    days: 'Dia',
    sections: 'Seção',
    blocks: 'Bloco',
    rounds: 'Round',
}

export const timerTypes: Record<TTimerTypes, string> = {
    not_timed: 'Sem tempo',
    for_time: 'For Time',
    amrap: 'AMRAP',
    emom: 'EMOM',
    tabata: 'Tabata',
}

export const eventTypes = {
    ...timerTypes,
    max_weight: 'Carga máxima',
}

export const roundTypes = {
    default: 'Padrão',
    complex: 'Complex',
    rest: 'Rest',
}
