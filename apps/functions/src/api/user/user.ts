import { init } from '../../helpers'
import { createHttpsError } from '../../utils/createHttpsError'
import { getAuth } from 'firebase-admin/auth'
import { https } from 'firebase-functions'
import { pick } from 'radash'

init()

interface UserData {
    displayName: string
    email: string
    password: string
    phoneNumber?: string
}

/**
 * @Deprecated
 */
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

export const updateUser = https.onCall(async ({ uid, data }: { uid: string; data: Partial<UserData> }, context) => {
    try {
        if (!context.auth?.token.admin && uid !== context.auth?.uid) throw new Error('User does not have permission')

        const auth = getAuth()
        await auth.updateUser(uid, pick(data, ['displayName', 'email', 'phoneNumber']))
    } catch (err: any) {
        throw new https.HttpsError('unknown', err.code, { message: err.message, code: err.code })
    }
})

/**
 * @Deprecated
 */
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
