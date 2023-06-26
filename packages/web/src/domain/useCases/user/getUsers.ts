import { firebaseProvider } from '@common/providers/firebase'
import { IPagination } from '@interfaces/app'
import { ListUsersResult } from '@models/user'

const getUsersFn = firebaseProvider.FUNCTION_CALL<IPagination, ListUsersResult>('getUsers')

export async function getUsersUseCase(args: IPagination): Promise<ListUsersResult> {
    const result = await getUsersFn(args)

    return result.data
}
