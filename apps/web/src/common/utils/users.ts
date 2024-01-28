import { IUserContext } from 'goal-models'
import { pick } from 'radash'

import { User } from '@supabase/supabase-js'

export function extractUserCredential(user: User): IUserContext | null {
    const credential = pick(user, ['id', 'phone'])

    return {
        ...credential,
        displayName: user.user_metadata.displayName,
        photoUrl: user.user_metadata.photoUrl || null,
        email: user.email || '',
        claims: pick(user.app_metadata, ['claims_admin']),
    }
}
