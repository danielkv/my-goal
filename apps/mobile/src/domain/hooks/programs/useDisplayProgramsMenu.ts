import useSWR from 'swr'

import { useLoggedUser } from '@contexts/user/userContext'
import { getProgramListUseCase } from '@useCases/programs/getProgramList'

export function useDisplayProgramsMenu() {
    const user = useLoggedUser()

    const { data } = useSWR(
        () => (!!user ? ['programList', 0, 10] : null),
        () => getProgramListUseCase({}),
        {
            refreshInterval(data) {
                if (data?.items.length) return 0
                return 60000
            },
        }
    )

    if (!user || !data) return false

    return data.items.length > 0
}
