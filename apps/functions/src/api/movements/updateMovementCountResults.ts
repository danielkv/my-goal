import { init } from '../../helpers'
import { getFirestore } from 'firebase-admin/firestore'
import { firestore } from 'firebase-functions'

init()

export const updateMovementCountResults = firestore.document('movement_results/{documentId}').onWrite(async (e) => {
    const db = getFirestore()
    const snap = e.after.data() || e.before.data()
    if (!snap) return

    const movementId = snap.movementId

    const collectionRef = db.collection('movement_results')

    const results = await collectionRef.where('movementId', '==', movementId).count().get()
    const countResults = results.data().count

    await db.collection('movements').doc(movementId).update('countResults', countResults)
})
