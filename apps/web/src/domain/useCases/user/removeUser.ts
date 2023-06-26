import { firebaseProvider } from '@common/providers/firebase'
import { ListUsersResult } from '@models/user'

const removeUserFn = firebaseProvider.FUNCTION_CALL<string, ListUsersResult>('removeUser')

export async function removeUserUseCase(uid: string): Promise<void> {
    await removeUserFn(uid)
}
