import { IPaginatedResponse, IPagination, ISorting, IUser, IUserListItem } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export interface IGetUsers extends IPagination, ISorting<IUser> {}

type TResponse = IPaginatedResponse<IUserListItem>

export async function getUsersUseCase(args: IGetUsers): Promise<TResponse> {
    const { error, data } = await supabase.functions.invoke<TResponse>('listUsers', { method: 'POST', body: args })
    if (error) throw error
    if (!data) throw new Error('Ocorreu um erro ao carregar usuários')

    return data
}
