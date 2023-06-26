import { User } from 'firebase/auth'
import { pick } from 'radash'

import { IUserCredential } from '@models/user'

export function extractUserCredential(user: User): IUserCredential | null {
    const credential = pick(user, ['uid', 'email', 'displayName', 'photoURL', 'phoneNumber'])

    return {
        ...credential,
        displayName: credential.displayName || '',
        photoURL: credential.photoURL || '',
        phoneNumber: credential.phoneNumber || '',
        email: credential.email || '',
    }
}
