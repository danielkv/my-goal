import { IUserContext } from 'goal-models'

import { createSignal } from 'solid-js'

export const [loggedUser, setLoggedUser] = createSignal<IUserContext | null>(null)
