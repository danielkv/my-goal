export type ITimecapTimer = {
    type: 'for_time' | 'amrap'
    timecap: number
    numberOfRounds?: number
}

export type ITabataTimer = {
    type: 'tabata'
    work: number
    rest: number
    numberOfRounds?: number
}

export type IEMOMTimer = {
    type: 'emom'
    each: number
    numberOfRounds?: number
}

export type INotTimedTimer = {
    type: 'not_timed'
    numberOfRounds?: number
}

export type TTimerTypes = 'for_time' | 'amrap' | 'emom' | 'tabata' | 'not_timed'

export type TTimer = ITabataTimer | ITimecapTimer | IEMOMTimer | INotTimedTimer

export type TMergedTimer = Partial<ITabataTimer & ITimecapTimer & IEMOMTimer>
