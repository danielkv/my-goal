import { supabase } from '@common/providers/supabase'

export async function listUserPrograms(userId: string) {
    const { error, data } = await supabase.from('user_programs').select('*, program:programs(*)').eq('user_id', userId)
    if (error) throw error

    return data
}
