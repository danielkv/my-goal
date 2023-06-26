import { firebaseProvider } from '@common/providers/firebase'

export async function logMessageUseCase(data: Record<any, string>): Promise<void> {
    const fs = firebaseProvider.getFirestore()

    await fs.collection('logs').add(data)
}
