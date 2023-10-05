import { getDocs } from 'firebase/firestore'
import { IDayModel } from 'goal-models'
import { collections } from 'goal-utils'

import { firebaseProvider } from '@common/providers/firebase'
import { dayConverter } from '@utils/converters'

export async function getTempWorksheetDaysUseCase(tempWorksheetId: string): Promise<IDayModel[]> {
    const collectionRef = firebaseProvider
        .firestore()
        .collection(`${collections.TEMP_WORKSHEETS}/${tempWorksheetId}/days`)
        .withConverter(dayConverter)

    const query = firebaseProvider.firestore().query(collectionRef, firebaseProvider.firestore().orderBy('date'))
    const daysDocs = await getDocs(query)

    return daysDocs.docs.map((doc) => doc.data())
}
