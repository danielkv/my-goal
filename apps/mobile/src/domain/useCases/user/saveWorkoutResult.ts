import { IUserWorkoutResultInput } from 'goal-models'

export async function saveWorkoutResult(result: Omit<IUserWorkoutResultInput, 'createdAt'>): Promise<void> {}
