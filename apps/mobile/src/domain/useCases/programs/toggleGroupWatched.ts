import dayjs from 'dayjs'

import { supabase } from '@common/providers/supabase'

export async function toggleGroupWatchedUseCase(userId: string, groupId: string): Promise<void> {
    const { error, data } = await supabase
        .from('user_groups_details')
        .select()
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .maybeSingle()

    if (error) throw error

    if (!data) {
        const { error } = await supabase
            .from('user_groups_details')
            .insert({ group_id: groupId, user_id: userId, watched_at: dayjs().toISOString() })

        if (error) throw error
    } else {
        const { error } = await supabase
            .from('user_groups_details')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', userId)

        if (error) throw error
    }
}
