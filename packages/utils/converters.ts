import { FirestoreDataConverter } from 'firebase/firestore'
import { pick } from 'radash'

import { IDayModel, IWorksheetModel } from '@models/day'

import { removeNull } from './removeNull'

export const dayConverter: FirestoreDataConverter<IDayModel> = {
    fromFirestore(snapshot) {
        return {
            ...(snapshot.data() as IDayModel),
            id: snapshot.id,
        }
    },
    toFirestore(model) {
        const day = removeNull(pick(model, ['date', 'name', 'periods']))

        return day
    },
}

export const worksheetConverter: FirestoreDataConverter<Omit<IWorksheetModel, 'days' | 'isCurrent'>> = {
    fromFirestore(snapshot) {
        return {
            ...(snapshot.data() as IWorksheetModel),
            id: snapshot.id,
        }
    },
    toFirestore(model) {
        const result = removeNull(pick(model, ['info', 'name', 'published', 'startDate', 'startEndDate']))

        return result
    },
}
