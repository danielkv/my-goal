import { init } from '../../helpers'
import { createHttpsError } from '../../utils/createHttpsError'
import * as enableCors from 'cors'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { auth, https } from 'firebase-functions'
import { pick } from 'radash'

init()

const cors = enableCors({ origin: true })

interface UserData {
    displayName: string
    email: string
    password: string
    phoneNumber?: string
}

export const copyUserDataToCollection = auth.user().onCreate((user) => {
    const fs = getFirestore()

    const userData = pick(user, ['uid', 'email', 'emailVerified', 'displayName', 'photoURL', 'phoneNumber'])

    return fs.collection('user_data').doc(user.uid).create(userData)
})

export const getUserByEmail = https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const email = req.query.email as string
            if (!email) throw new Error('Email not found')

            const auth = getAuth()
            const response = await auth.getUserByEmail(email)

            if (!response) throw new Error('User not found')

            res.json(
                pick(response, ['uid', 'email', 'emailVerified', 'displayName', 'photoURL', 'phoneNumber', 'disabled'])
            )
        } catch (err) {
            res.status(400).send((err as Error).message)
        }
    })
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
    const fs = getFirestore()

    try {
        if (!context.auth?.token.admin && uid !== context.auth?.uid) throw new Error('User does not have permission')

        const normalizedData = pick(data, ['displayName', 'email', 'phoneNumber'])
        const auth = getAuth()
        await auth.updateUser(uid, normalizedData)

        await fs.collection('user_data').doc(uid).update(normalizedData)
    } catch (err: any) {
        throw new https.HttpsError('unknown', err.code, { message: err.message, code: err.code })
    }
})
