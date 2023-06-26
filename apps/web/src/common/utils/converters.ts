import { FirestoreDataConverter } from 'firebase/firestore'
import { IDayModel, IWorksheetModel } from 'goal-models'
import { removeNull } from 'goal-utils'
import { pick } from 'radash'

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
