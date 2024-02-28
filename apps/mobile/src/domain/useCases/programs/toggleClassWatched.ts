import dayjs from 'dayjs'

import { supabase } from '@common/providers/supabase'

export async function toggleClassWatchedUseCase(userId: string, classId: string, newStatus: boolean): Promise<void> {
    const { error, data } = await supabase
        .from('user_classes_details')
        .select()
        .eq('class_id', classId)
        .eq('user_id', userId)
        .maybeSingle()

    if (error) throw error

    if (!data) {
        const { error } = await supabase
            .from('user_classes_details')
            .insert({ class_id: classId, user_id: userId, watched_at: dayjs().toISOString() })

        if (error) throw error
    } else {
        const { error } = await supabase
            .from('user_classes_details')
            .delete()
            .eq('class_id', classId)
            .eq('user_id', userId)

        if (error) throw error
    }
}
