import EmomSvg from '@assets/svg/emom.svg'
import RegressiveSvg from '@assets/svg/regressive.svg'
import StopwatchSvg from '@assets/svg/stopwatch.svg'
import TabataIcon from '@assets/svg/tabata.svg'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'

import { H3, XStack, YStack } from 'tamagui'

import TimerCard from './components/Card'

const TimersScreen: React.FC = () => {
    const { navigate } = useNavigation()
    return (
        <YStack px="$7" py="$4">
            <H3 fontWeight="700" mb="$4" ta="center" color="white">
                Selecione o Timer
            </H3>
            <XStack gap="$4" mb="$4">
                <TimerCard
                    title="Stopwatch"
                    Icon={StopwatchSvg}
                    onPress={() => navigate(ERouteName.StopwatchTimerScreen)}
                />
                <TimerCard
                    title="Regressivo"
                    Icon={RegressiveSvg}
                    onPress={() => navigate(ERouteName.RegressiveTimerScreen)}
                />
            </XStack>
            <XStack gap="$4">
                <TimerCard title="Tabata" Icon={TabataIcon} onPress={() => navigate(ERouteName.TabataTimerScreen)} />
                <TimerCard title="EMOM" Icon={EmomSvg} onPress={() => navigate(ERouteName.EmomTimerScreen)} />
            </XStack>
        </YStack>
    )
}

export default TimersScreen
