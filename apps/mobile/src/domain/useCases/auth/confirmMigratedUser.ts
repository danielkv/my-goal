import { supabase } from '@common/providers/supabase'

export async function confirmMigratedUser(fbuid: string): Promise<void> {
    const { error } = await supabase.functions.invoke('/users/confirm-migrated-user', {
        method: 'POST',
        body: { fbuid },
    })
    if (error) throw error
}
