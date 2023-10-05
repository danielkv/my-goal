// Description: Create UserData collection
// Migration version: da3f56216dbc
// Created at: 18//08/2023 15:01:55
//
import * as admin from 'firebase-admin'
import { IUserData } from 'goal-models'
import { collections } from 'goal-utils'
import { pick } from 'radash'

export async function migrate(db: admin.firestore.Firestore) {
    const { users } = await admin.auth().listUsers()
    const usersCollection = db.collection(collections.USER_DATA)

    await db.runTransaction(async (transaction) => {
        users.forEach((user) => {
            const docRef = usersCollection.doc(user.uid)

            const userData: IUserData = pick(user, [
                'uid',
                'email',
                'emailVerified',
                'displayName',
                'photoURL',
                'phoneNumber',
            ])
            transaction.create(docRef, userData)
        })
    })
}

export async function rollback(db: admin.firestore.Firestore) {}
