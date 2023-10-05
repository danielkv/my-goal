import { TResultType, TTimerTypes } from 'goal-models'

export function getWorkoutRestultType(type?: TTimerTypes): TResultType | null {
    switch (type) {
        case 'amrap':
            return 'reps'
        case 'emom':
        case 'for_time':
            return 'time'
        default:
            return null
    }
}
