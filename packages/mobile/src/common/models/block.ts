import { IEMOMTimer, ITabataTimer, ITimecapTimer, TTimerTypes } from './time'

export type TWeightTypes = 'kg' | 'lb' | '%' | 'none'

export interface IMovementWeight {
    type: TWeightTypes
    value: string
}

export interface IEventMovement {
    name: string
    reps: string
    weight?: IMovementWeight
    videoUrl?: string
}

export type IRoundTimecap = {
    type: Exclude<TTimerTypes, 'emom' | 'not_timed' | 'tabata'>
} & ITimecapTimer

export type IRoundEMOM = {
    type: 'emom'
} & IEMOMTimer

export type IRoundTabata = {
    type: 'tabata'
} & ITabataTimer

export type IRoundRest = {
    type: 'rest'
    time: number
}

export type IRoundNotTimed = {
    type: 'not_timed' | 'complex'
}

export type TRoundTypes = TTimerTypes | 'rest' | 'complex'

export type IRound = {
    type: TRoundTypes
    numberOfRounds?: number
    movements: IEventMovement[]
} & (IRoundTimecap | IRoundEMOM | IRoundTabata | IRoundRest | IRoundNotTimed)

export type IEventBlockEMOM = {
    event_type: 'emom'
} & IEMOMTimer

export type IEventBlockTabata = {
    event_type: 'tabata'
} & ITabataTimer

export type TEventType = TTimerTypes | 'max_weight'

export type IEventBlockTimecap = {
    event_type: 'for_time' | 'amrap' | 'max_weight'
} & ITimecapTimer

export type IEventBlockNotTimed = {
    event_type: 'not_timed'
}

export type IEventBlock = {
    type: 'event'
    name?: string
    rounds: IRound[]
    event_type: TEventType
    numberOfRounds?: number
    info?: string
} & (IEventBlockEMOM | IEventBlockTimecap | IEventBlockNotTimed | IEventBlockTabata)

export interface IRestBlock {
    type: 'rest'
    time: number
    text?: string
}

export interface ITextBlock {
    type: 'text'
    text: string
}

export interface EmptyBlock {
    type: ''
}

export type TBlockType = 'event' | 'rest' | 'text' | ''
export type IBlock = { info?: string; type: TBlockType } & (IEventBlock | IRestBlock | ITextBlock | EmptyBlock)
