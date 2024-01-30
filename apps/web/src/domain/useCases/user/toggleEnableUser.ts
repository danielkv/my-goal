import { supabase } from '@common/providers/supabase'

export async function toggleEnableUserUseCase(id: string, action: 'enable' | 'disable'): Promise<void> {
    const { error } = await supabase.functions.invoke('toggleEnableUser', {
        method: 'POST',
        body: { userId: id, action },
    })
    if (error) throw error
}
