import { pick } from 'radash'

import { IUserCredential } from '@models/user'
import { User } from '@supabase/supabase-js'

export function extractUserCredential(user: User): IUserCredential | null {
    const credential = pick(user, ['id', 'phone'])

    return {
        ...credential,
        displayName: user.user_metadata.displayName,
        photoUrl: user.user_metadata.photoUrl || null,
        email: user.email || '',
    }
}
