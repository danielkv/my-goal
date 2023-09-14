import dayjs from 'dayjs'
import { IUserData, TResultType } from 'goal-models'

export function isUserDataComplete(user?: IUserData | null): boolean {
    if (!user) return false
    if (!user.displayName || !user.email) return false

    return true
}

export function displayResultValue(type: TResultType, value: number): string {
    switch (type) {
        case 'reps':
            return `${value} reps`
        case 'time':
            return dayjs.duration(value, 'seconds').format('mm:ss')
        case 'weight':
            return `${value}kg`
    }
}
