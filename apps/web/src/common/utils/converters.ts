import { FirestoreDataConverter } from 'firebase/firestore'
import { IDayModel, IMovement, IWorksheetModel } from 'goal-models'
import { removeNull } from 'goal-utils'
import { omit, pick } from 'radash'

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

export const movementConverter: FirestoreDataConverter<IMovement> = {
    fromFirestore(snapshot) {
        return {
            ...(snapshot.data() as IMovement),
            id: snapshot.id,
        }
    },
    toFirestore(model) {
        const result = removeNull(omit(model, ['id']))

        const movement_insensitive = result.movement?.toString().toLowerCase()

        return { ...result, movement_insensitive, countResults: result.countResults || 0 }
    },
}
