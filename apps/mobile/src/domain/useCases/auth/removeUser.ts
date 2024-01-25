import { supabase } from '@common/providers/supabase'
import { getErrorMessage } from '@utils/getErrorMessage'

export async function deleteAccountUseCase(): Promise<void> {
    const { error, data } = await supabase.auth.getUser()
    if (error) throw new Error('Ocorreu um erro ao solicitar usuário')

    const userId = data.user.id

    const { error: deleteError } = await supabase.functions.invoke('deleteAccount', { body: { userId } })
    if (deleteError) throw new Error(`Ocorreu um erro ao excluir conta: ${getErrorMessage(deleteError)}`)
}
