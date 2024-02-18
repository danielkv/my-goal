import { supabase } from '@common/providers/supabase'

export async function removeUserUseCase(userId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('removeUser', {
        method: 'POST',
        body: { userId },
    })
    if (error) throw error
}
