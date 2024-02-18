import { ANALYTICS_EVENTS, IUserMovementResultInput } from 'goal-models'

import { firebaseProvider } from '@common/providers/firebase'
import { supabase } from '@common/providers/supabase'

export async function saveMovementResultUseCase(result: IUserMovementResultInput): Promise<void> {
    const { error } = await supabase.from('movement_results').insert(result)
    if (error) throw error

    await firebaseProvider.getAnalytics().logEvent(ANALYTICS_EVENTS.SAVE_PR)
}
