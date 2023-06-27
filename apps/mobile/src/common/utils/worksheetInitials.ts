import { TTimerTypes } from 'goal-models'

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
    ...timerTypes,
    complex: 'Complex',
    rest: 'Rest',
}
