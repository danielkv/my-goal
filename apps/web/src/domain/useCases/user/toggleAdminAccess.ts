import { supabase } from '@common/providers/supabase'

export async function toggleAdminAccessUseCase(id: string, action: 'promote' | 'demote'): Promise<void> {
    const { error } = await supabase.functions.invoke('/users/toggle-user-claim-admin', {
        method: 'POST',
        body: { userId: id, action },
    })
    if (error) throw error
}
