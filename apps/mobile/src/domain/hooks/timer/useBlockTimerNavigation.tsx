import { IEventBlock, IRound, TTimerSettings } from 'goal-models'
import {
    TOpenTimerAllowedTypes,
    blockTimerSettings,
    blockTimerType,
    checkIsTimedWorkout,
    isRestRound,
    roundDisplay,
    roundTimerSettings,
    roundTimerType,
} from 'goal-utils'

import { IAlertButton } from '@components/AppAlert/types'
import { alert } from '@components/AppAlert/utils'
import TimerIcon from '@components/TimerIcon'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'

export function useBlockTimerNavigation() {
    const { navigate } = useNavigation()

    const handleOpenRoundMode = (rounds: IRound[]) => {
        if (rounds.length === 1) {
            const round = rounds[0]
            const settings = roundTimerSettings(round)
            const type = roundTimerType(round)

            if (!type) return

            return handleNavigateToTimer(type, settings, { round })
        }

        const filteredRounds = rounds.filter(
            (round) => isRestRound(round) || ['for_time', 'emom', 'amrap', 'tabata'].includes(round.config.type)
        )

        const buttons = filteredRounds.map<IAlertButton>((round) => {
            const text = roundDisplay.displayHeader(round)
            const settings = roundTimerSettings(round)
            const type = roundTimerType(round)

            return {
                text,
                icon: <TimerIcon name={type || 'for_time'} size={14} color="white" />,
                onPress: () => handleNavigateToTimer(type || 'for_time', settings, { round }),
            }
        })

        setTimeout(() => alert('Selecione o round', buttons, true), 150)
    }

    const handleOpenTimerPress = (block: IEventBlock) => {
        const timerMode = checkIsTimedWorkout(block)

        if (timerMode === 'round') return handleOpenRoundMode(block.rounds)

        const type = blockTimerType(block)

        if (timerMode === 'block' && block) return navigate(ERouteName.WodTimer, { block })

        if (timerMode === 'none' && !type) {
            return navigate(ERouteName.TimersScreen, {
                block,
            })
        }

        const settings = blockTimerSettings(block)

        if (!type || !settings) return

        handleNavigateToTimer(type, settings, { block })
    }

    const handleNavigateToTimer = (
        type: TOpenTimerAllowedTypes,
        settings: TTimerSettings,
        { block, round }: { block?: IEventBlock; round?: IRound }
    ) => {
        switch (type) {
            case 'for_time':
            case 'amrap':
                if (settings.timecap)
                    return navigate(ERouteName.RegressiveTimerScreen, {
                        numberOfRounds: settings.numberOfRounds,
                        timecap: settings.timecap,
                        block,
                        round,
                    })
                else
                    return navigate(ERouteName.StopwatchTimerScreen, {
                        numberOfRounds: settings.numberOfRounds,
                        block,
                        round,
                    })
            case 'emom':
                return navigate(ERouteName.EmomTimerScreen, {
                    numberOfRounds: settings.numberOfRounds,
                    each: settings.each,
                    block,
                    round,
                })
            case 'tabata':
                return navigate(ERouteName.TabataTimerScreen, {
                    numberOfRounds: settings.numberOfRounds,
                    work: settings.work,
                    rest: settings.rest,
                    block,
                    round,
                })
        }
    }

    return {
        handleOpenTimerPress,
    }
}
