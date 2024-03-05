import dayjs from 'dayjs'

import { supabase } from '@common/providers/supabase'

export async function expireUserProgramUseCase(id: string) {
    const { error, data } = await supabase
        .from('user_programs')
        .update({ expires_at: dayjs().subtract(1, 'second').toISOString() })
        .eq('id', id)
    if (error) throw error

    return data
}
