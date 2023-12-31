import { TouchableOpacity } from 'react-native'

import { IEventBlock, IRound } from 'goal-models'
import { TOpenTimerAllowedTypes, TTimedMode, blockTimerSettings, roundTimerSettings } from 'goal-utils'

import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'

export type OpenTimerButtonProps = {
    disabled?: boolean
    children: React.ReactNode
    timedWorkoutMode?: TTimedMode
    type: TOpenTimerAllowedTypes | null
} & ({ round: IRound; block?: never } | { block: IEventBlock; round?: never })

const OpenTimerButton: React.FC<OpenTimerButtonProps> = ({
    block,
    round,
    children,
    disabled,
    type,
    timedWorkoutMode: _timedWorkoutMode,
}) => {
    const { navigate } = useNavigation()

    const timedWorkoutMode = _timedWorkoutMode || 'round'
    const settings = block ? blockTimerSettings(block) : round ? roundTimerSettings(round) : null

    if (timedWorkoutMode === 'round' && (!type || !settings)) {
        return <>{children}</>
    }

    const handleOnPress = () => {
        if (timedWorkoutMode === 'block' && block) return navigate(ERouteName.WodTimer, { block })

        if (timedWorkoutMode === 'none' && !type) {
            return navigate(ERouteName.TimersScreen, {
                block,
                round,
            })
        }

        if (!type || !settings) return

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

    return (
        <TouchableOpacity disabled={disabled} onPress={handleOnPress}>
            {children}
        </TouchableOpacity>
    )
}

export default OpenTimerButton
