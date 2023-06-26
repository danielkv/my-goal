import { getDocs } from 'firebase/firestore'

import { firebaseProvider } from '@common/providers/firebase'
import { IDayModel } from '@models/day'
import { dayConverter } from '@utils/converters'

export async function getTempWorksheetDaysUseCase(tempWorksheetId: string): Promise<IDayModel[]> {
    const collectionRef = firebaseProvider
        .firestore()
        .collection(`temp_worksheets/${tempWorksheetId}/days`)
        .withConverter(dayConverter)

    const query = firebaseProvider.firestore().query(collectionRef, firebaseProvider.firestore().orderBy('date'))
    const daysDocs = await getDocs(query)

    return daysDocs.docs.map((doc) => doc.data())
}
