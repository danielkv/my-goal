import { pick } from 'radash'

import { supabase } from '@common/providers/supabase'
import { extractSupabaseUserCredential } from '@contexts/user/userContext'
import { setLoggedUser } from '@helpers/authentication/setLoggedUser'
import { IUserInput } from '@models/user'

export async function updateUserUseCase(userInput: Partial<Omit<IUserInput, 'password'>>): Promise<void> {
    const { data, error } = await supabase.auth.updateUser({
        email: userInput.email,
        phone: userInput.phone,
        data: pick(userInput, ['displayName', 'phone']),
    })
    if (error) throw error
    if (data.user) setLoggedUser(extractSupabaseUserCredential(data.user))
}
