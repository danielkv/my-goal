import { firebaseProvider } from '@common/providers/firebase'
import { ListUsersResult } from '@models/user'

const toggleEnableUserFn = firebaseProvider.FUNCTION_CALL<string, ListUsersResult>('toggleEnableUser')

export async function toggleEnableUserUseCase(uid: string): Promise<void> {
    await toggleEnableUserFn(uid)
}
