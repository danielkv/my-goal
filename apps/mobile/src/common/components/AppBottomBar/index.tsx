import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { XStack } from 'tamagui'

import { useOrientation } from '@common/hooks/useOrientation'
import MenuButton from '@components/MenuButton'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { FileSpreadsheet, Home, Layers, Timer } from '@tamagui/lucide-icons'

const AppBottomBar: React.FC = () => {
    const { navigate } = useNavigation()
    const orientation = useOrientation()

    const { bottom } = useSafeAreaInsets()

    if (orientation === 'landscape') return null

    return (
        <XStack gap={5} jc="center" bg="$gray9" h={60 + bottom} pb={bottom}>
            <MenuButton
                label="Home"
                Icon={() => <Home size={22} color="$gray4" />}
                onPress={() => navigate(ERouteName.HomeScreen)}
            />
            <MenuButton
                label="Planilhas"
                Icon={() => <FileSpreadsheet size={22} color="$gray4" />}
                onPress={() => navigate(ERouteName.WorksheetList)}
            />
            <MenuButton
                label="Programas"
                Icon={() => <Layers size={22} color="$gray4" />}
                onPress={() => navigate(ERouteName.ProgramList)}
            />
            <MenuButton
                label="Timers"
                Icon={() => <Timer size={22} color="$gray4" />}
                onPress={() => navigate(ERouteName.TimersScreen)}
            />
        </XStack>
    )
}

export default AppBottomBar
