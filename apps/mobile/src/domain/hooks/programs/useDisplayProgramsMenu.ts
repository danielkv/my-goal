import useSWR from 'swr'

import { useLoggedUser } from '@contexts/user/userContext'
import { getProgramListUseCase } from '@useCases/programs/getProgramList'

export function useDisplayProgramsMenu() {
    const user = useLoggedUser()

    const { data } = useSWR(
        () => (!!user ? ['programList', 0, 10] : null),
        () => getProgramListUseCase({})
    )

    if (!user || !data) return false

    return data.items.length > 0
}
