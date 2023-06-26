import { firebaseProvider } from '@common/providers/firebase'
import { ListUsersResult } from '@models/user'

const toggleAdminAccessFn = firebaseProvider.FUNCTION_CALL<string, ListUsersResult>('toggleAdminAccess')

export async function toggleAdminAccessUseCase(uid: string): Promise<void> {
    await toggleAdminAccessFn(uid)
}
