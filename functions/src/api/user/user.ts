import { getAuth } from 'firebase-admin/auth'
import { https } from 'firebase-functions'
import { pick } from 'radash'

import { init } from '../../helpers'
import { createHttpsError } from '../../utils/createHttpsError'

init()

interface UserData {
    displayName: string
    email: string
    password: string
}

export const createNewUser = https.onCall(async (data: UserData) => {
    const auth = getAuth()

    try {
        const newUser = await auth.createUser({ ...data, disabled: false, emailVerified: false })

        return newUser
    } catch (err) {
        throw createHttpsError(err)
    }
})

export const getUsers = https.onCall(async (data: { limit?: number; pageToken?: string }) => {
    try {
        const auth = getAuth()
        const list = await auth.listUsers(data.limit || 20, data.pageToken || undefined)

        return {
            pageToken: list.pageToken,
            users: list.users.map((user) =>
                pick(user, [
                    'uid',
                    'email',
                    'emailVerified',
                    'displayName',
                    'photoURL',
                    'phoneNumber',
                    'disabled',
                    'customClaims',
                ])
            ),
        }
    } catch (err) {
        console.log(err)
        throw createHttpsError(err)
    }
})

export const removeUser = https.onCall(async (uuid: string) => {
    const auth = getAuth()

    try {
        await auth.deleteUser(uuid)
    } catch (err) {
        throw createHttpsError(err)
    }
})

export const verifyEmail = https.onRequest(async (request, response) => {
    const email = request.query.email
    if (!email || typeof email !== 'string') {
        response.sendStatus(500)
        return
    }

    if (!['google.com', 'apple.com'].includes(email.split('@')[1])) {
        response.sendStatus(500)
        return
    }

    const user = await getAuth().getUserByEmail(email)
    await getAuth().updateUser(user.uid, {
        emailVerified: true,
    })

    response.sendStatus(200)
})
