import { firestore } from 'firebase-admin'

export async function getDays(worksheetDocRef: firestore.DocumentReference) {
    const daysDocs = await worksheetDocRef.collection('days').orderBy('date').get()

    return daysDocs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    })) as Record<string, any>[]
}
