export type TWeightTypes = 'kg' | 'lb' | '%' | 'none'

export type IMovementWeight = {
    type: TWeightTypes
    value: string
}

export type Typefy<T> = {
    [P in keyof T]: T extends object ? Typefy<T[P]> : T[P]
}
