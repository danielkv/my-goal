import { TTimer } from './time'

export type TWeightTypes = 'kg' | 'lb' | '%' | 'none'

export type IMovementWeight = {
    type: TWeightTypes
    value: string
}

export type IEventMovement = {
    name: string
    reps: string
    weight?: IMovementWeight
    videoUrl?: string
}

export type TRoundTypes = 'rest' | 'complex'

export type IRestRound = {
    type: 'rest'
    time: number
}

export type IComplexRound = {
    type: 'complex'
    movements: IEventMovement[]
    config: TTimer
}

export type IRound =
    | {
          type?: TRoundTypes
          movements: IEventMovement[]
          config: TTimer
      }
    | IRestRound
    | IComplexRound

export type TBlockType = 'event' | 'rest' | 'text' | ''

//export type TEventType = 'default' | 'max_weight'

export type IEventBlock = {
    type: 'event'
    name?: string
    rounds: IRound[]
    //event_type: TEventType
    info?: string
    config: TTimer
}

export type IRestBlock = {
    type: 'rest'
    time: number
    text?: string
}

export type ITextBlock = {
    type: 'text'
    text: string
}

export type IEmptyBlock = {
    type: ''
}

export type IBlock = { info?: string; type: TBlockType } & (IEventBlock | IRestBlock | ITextBlock | IEmptyBlock)
