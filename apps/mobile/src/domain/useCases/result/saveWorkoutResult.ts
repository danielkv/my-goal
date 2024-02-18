import { ANALYTICS_EVENTS, IUserWorkoutResultInput } from 'goal-models'

import { firebaseProvider } from '@common/providers/firebase'
import { supabase } from '@common/providers/supabase'

export async function saveWorkoutResult(result: IUserWorkoutResultInput): Promise<void> {
    const { error } = await supabase.from('workout_results').insert(result)
    if (error) throw error
    await firebaseProvider.getAnalytics().logEvent(ANALYTICS_EVENTS.SAVE_WORKOUT_RESULT)
}
