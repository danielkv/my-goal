export type TResultType = 'time' | 'reps' | 'weight'

export interface IWorkoutResult {
    type: TResultType
    value: number
}

export interface IUserResult {
    id: string
    uid: string
    createdAt: string
    date: string
    isPrivate: boolean
    result: IWorkoutResult
}
