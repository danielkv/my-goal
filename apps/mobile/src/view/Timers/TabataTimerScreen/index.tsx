import { useState } from 'react'

import TabataSvg from '@assets/svg/tabata.svg'
import Button from '@components/Button'
import SafeAreaView from '@components/SafeAreaView'
import TimerForm from '@components/TimerForm'
import { RouteProp, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'

import { ScrollView, Stack, YStack } from 'tamagui'

import TabataDisplay from './timer'

const TabataTimerScreen: React.FC = () => {
    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'TabataTimerScreen'>>()

    const [state, setState] = useState<'form' | 'timer'>('form')

    const [work, setWork] = useState(() => params?.work || 20)
    const [rest, setRest] = useState(() => params?.rest || 10)
    const [rounds, setRounds] = useState(() => params?.numberOfRounds || 8)
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
                            type="tabata"
                            rounds={rounds}
                            onChangeRounds={setRounds}
                            countdown={countdown}
                            onChangeCountdown={setupCountdown}
                            Icon={TabataSvg}
                            time1={work}
                            onChangeTime1={setWork}
                            time2={rest}
                            onChangeTime2={setRest}
                        />
                        <Stack px="$13">
                            <Button variant="primary" onPress={() => setState('timer')}>
                                Aplicar
                            </Button>
                        </Stack>
                    </YStack>
                </ScrollView>
            ) : (
                <TabataDisplay
                    initialCountdown={countdown}
                    work={work}
                    rest={rest}
                    rounds={rounds}
                    onPressReset={() => setState('form')}
                    block={params?.block}
                    round={params?.round}
                />
            )}
        </SafeAreaView>
    )
}

export default TabataTimerScreen
