import { init } from '../../helpers'
import * as admin from 'firebase-admin'
import { https } from 'firebase-functions'

init()

/**
 * @Deprecated
 */
export const logMessage = https.onCall(async (data: any) => {
    const db = admin.firestore()

    await db.collection('logs').doc().create(data)
})
