import { PropsWithChildren } from 'react'

import AppAlert from '.'
import { useAppAlertState } from './utils'

const AppAlertProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const alertProps = useAppAlertState()

    return (
        <>
            {children}
            <AppAlert {...alertProps} />
        </>
    )
}

export default AppAlertProvider
