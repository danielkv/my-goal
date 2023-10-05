import { useState } from 'react'

import { ScrollView, Stack, YStack } from 'tamagui'

import RegressiveSvg from '@assets/svg/regressive.svg'
import Button from '@components/Button'
import SafeAreaView from '@components/SafeAreaView'
import TimerForm from '@components/TimerForm'
import { RouteProp, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'

import RegressiveDisplay from './timer'

const RegressiveTimerScreen: React.FC = () => {
    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'RegressiveTimerScreen'>>()

    const [state, setState] = useState<'form' | 'timer'>('form')

    const [time1, setTime1] = useState(() => params?.timecap || 600)
    const [countdown, setupCountdown] = useState(3)

    return (
        <SafeAreaView flex={1} keyboardVerticalOffset={70}>
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
                            type="regressive"
                            Icon={RegressiveSvg}
                            time1={time1}
                            onChangeTime1={setTime1}
                        />
                        <Stack px="$13">
                            <Button variant="primary" onPress={() => setState('timer')}>
                                Aplicar
                            </Button>
                        </Stack>
                    </YStack>
                </ScrollView>
            ) : (
                <RegressiveDisplay
                    initialCountdown={countdown}
                    initialTime={time1}
                    onPressReset={() => setState('form')}
                    block={params?.block}
                    round={params?.round}
                />
            )}
        </SafeAreaView>
    )
}

export default RegressiveTimerScreen
