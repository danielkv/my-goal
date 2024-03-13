import { IMovementWeight } from './shared'
import { TTimer } from './time'

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

export type IBlockV1 = { info?: string; type: TBlockType; v2?: false | undefined } & (
    | IEventBlock
    | IRestBlock
    | ITextBlock
    | IEmptyBlock
)

export type IBlockV2 = { v2: true; text: string }

export type IBlock = IBlockV1 | IBlockV2
