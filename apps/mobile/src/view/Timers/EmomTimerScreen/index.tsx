import { useState } from 'react'

import { ScrollView, Stack, YStack } from 'tamagui'

import EmomSvg from '@assets/svg/emom.svg'
import Button from '@components/Button'
import SafeAreaView from '@components/SafeAreaView'
import TimerForm from '@components/TimerForm'
import { RouteProp, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'

import EmomDisplay from './timer'

const EmomTimerScreen: React.FC = () => {
    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'EmomTimerScreen'>>()

    const [state, setState] = useState<'form' | 'timer'>('form')

    const [each, setEach] = useState(() => params?.each || 60)
    const [rounds, setRounds] = useState(() => params?.numberOfRounds || 5)
    const [countdown, setupCountdown] = useState(3)

    return (
        <SafeAreaView flex={1} keyboardVerticalOffset={70}>
            {state === 'form' ? (
                <ScrollView f={1} contentContainerStyle={{ paddingVertical: 35 }} keyboardShouldPersistTaps="handled">
                    <YStack gap="$4">
                        <TimerForm
                            type="emom"
                            rounds={rounds}
                            onChangeRounds={setRounds}
                            countdown={countdown}
                            onChangeCountdown={setupCountdown}
                            Icon={EmomSvg}
                            time1={each}
                            onChangeTime1={setEach}
                        />
                        <Stack px="$13">
                            <Button variant="primary" onPress={() => setState('timer')}>
                                Aplicar
                            </Button>
                        </Stack>
                    </YStack>
                </ScrollView>
            ) : (
                <EmomDisplay
                    rounds={rounds}
                    initialCountdown={countdown}
                    each={each}
                    onPressReset={() => setState('form')}
                    block={params?.block}
                    round={params?.round}
                />
            )}
        </SafeAreaView>
    )
}

export default EmomTimerScreen
