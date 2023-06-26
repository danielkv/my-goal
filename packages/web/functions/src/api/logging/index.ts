import * as admin from 'firebase-admin'
import { https } from 'firebase-functions'

import { init } from '../../helpers'

init()

export const logMessage = https.onCall(async (data: any) => {
    const db = admin.firestore()

    await db.collection('logs').doc().create(data)
})
