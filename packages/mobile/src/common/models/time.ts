export type TTimerTypes = 'for_time' | 'emom' | 'amrap' | 'tabata' | 'not_timed'

export type ITabataTimer = {
    work: number
    rest: number
    numberOfRounds: number
}

export type ITimecapTimer = {
    timecap: number // seconds
    numberOfRounds: number
}

export type IEMOMTimer = {
    each: number
    numberOfRounds: number
}

export type TTimersForm = ITabataTimer | ITimecapTimer | IEMOMTimer
