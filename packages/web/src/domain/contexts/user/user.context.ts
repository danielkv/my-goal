import { createSignal } from 'solid-js'

import { IUserCredential } from '@models/user'

export const [loggedUser, setLoggedUser] = createSignal<IUserCredential | null>(null)
