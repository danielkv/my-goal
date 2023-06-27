import { getAuth } from 'firebase-admin/auth'
import { https } from 'firebase-functions'

import { init } from '../../helpers'

init()

export const toggleAdminAccess = https.onCall(async (uid: string, context) => {
    if (!context.auth?.token.admin) throw new Error('Forbiden')

    const user = await getAuth().getUser(uid)

    await getAuth().setCustomUserClaims(uid, { admin: !user.customClaims?.admin })
})

export const toggleEnableUser = https.onCall(async (uid: string, context) => {
    if (!context.auth?.token.admin) throw new Error('Forbiden')

    const user = await getAuth().getUser(uid)

    await getAuth().updateUser(uid, { disabled: !user.disabled })
})
