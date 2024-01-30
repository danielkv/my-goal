import { supabase } from '@common/providers/supabase'
import { IContactForm } from '@view/Home/config'

export async function sendEmailUseCase(data: IContactForm) {
    const { error } = await supabase.functions.invoke('sendEmail', { method: 'POST', body: data })
    if (error) throw error
}
