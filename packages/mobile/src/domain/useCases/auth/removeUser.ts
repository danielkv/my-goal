import { firebaseProvider } from '@common/providers/firebase'
import { createAppException } from '@utils/exceptions/AppException'

export async function removeUserUseCase(): Promise<void> {
    const auth = firebaseProvider.getAuth()

    if (!auth.currentUser) throw createAppException('NOT_LOGGED_IN', 'Nenhum usuário logado')

    await auth.currentUser.delete()
}
