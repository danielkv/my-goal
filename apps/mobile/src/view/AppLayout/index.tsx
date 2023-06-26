import AppBottomBar from '@components/AppBottomBar'
import Router from '@router/index'

import { Stack } from 'tamagui'

const AppLayout: React.FC = () => {
    return (
        <Stack f={1}>
            <Router />
            <AppBottomBar />
        </Stack>
    )
}

export default AppLayout
