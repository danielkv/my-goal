import { IUserData } from 'goal-models'

export function isUserDataComplete(user?: IUserData | null): boolean {
    if (!user) return false
    if (!user.displayName || !user.email) return false

    return true
}
