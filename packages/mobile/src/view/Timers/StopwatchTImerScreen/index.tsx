import { useState } from 'react'

import StopwatchSvg from '@assets/svg/stopwatch.svg'
import Button from '@components/Button'
import SafeAreaView from '@components/SafeAreaView'
import TimerForm from '@components/TimerForm'
import { RouteProp, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'

import { ScrollView, Stack, YStack } from 'tamagui'

import StopwatchDisplay from './timer'

const StopwatchTimerScreen: React.FC = () => {
    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'StopwatchTimerScreen'>>()

    const [state, setState] = useState<'form' | 'timer'>('form')

    const [timecap, setTimecap] = useState(() => params?.timecap || 0)
    const [countdown, setupCountdown] = useState(3)

    return (
        <SafeAreaView keyboardVerticalOffset={70}>
            {state === 'form' ? (
                <ScrollView
                    flex={1}
                    contentContainerStyle={{ paddingVertical: 35 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <YStack gap="$4">
                        <TimerForm
                            countdown={countdown}
                            onChangeCountdown={setupCountdown}
                            type="stopwatch"
                            Icon={StopwatchSvg}
                            time1={timecap}
                            onChangeTime1={setTimecap}
                        />
                        <Stack px="$13">
                            <Button variant="primary" onPress={() => setState('timer')}>
                                Aplicar
                            </Button>
                        </Stack>
                    </YStack>
                </ScrollView>
            ) : (
                <StopwatchDisplay
                    initialCountdown={countdown}
                    finalTime={timecap}
                    onPressReset={() => setState('form')}
                    block={params?.block}
                    round={params?.round}
                />
            )}
        </SafeAreaView>
    )
}

export default StopwatchTimerScreen
