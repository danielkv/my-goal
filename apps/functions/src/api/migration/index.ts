import { init } from '../../helpers'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { https } from 'firebase-functions'

init()

export const loadMigration = https.onRequest(async (req, res) => {
    const db = getFirestore()
    const auth = getAuth()

    try {
        const userId = req.body.userId
        if (!userId) throw new Error('missing params')

        const user = await auth.getUser(userId)
        if (!user) if (!userId) throw new Error('user not found')

        const collectionRef = db.collection('movement_results')

        const results = await collectionRef.where('uid', '==', userId).get()

        res.json(results.docs.map((row) => ({ ...row.data(), uid: row.id })))
    } catch (err) {
        res.status(500).send((err as Error).message)
    }
})
