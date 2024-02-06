import { IPaginatedResponse, IPagination, ISorting, IUser, IUserListItem } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export interface IGetUsers extends IPagination, ISorting<IUser> {
    search?: string
}

type TResponse = IPaginatedResponse<IUserListItem>

export async function getUsersUseCase(args: IGetUsers): Promise<TResponse> {
    const query = new URLSearchParams({
        page: String(args.page),
        pageSize: String(args.pageSize),
        sortBy: args.sortBy || 'displayName',
        order: args.order || 'asc',
        search: args.search || '',
    })

    const { error, data } = await supabase.functions.invoke<TResponse>(`users?${query.toString()}`, { method: 'GET' })
    if (error) throw error
    if (!data) throw new Error('Ocorreu um erro ao carregar usuários')

    return data
}
