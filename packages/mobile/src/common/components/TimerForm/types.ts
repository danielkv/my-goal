import { SvgProps } from 'react-native-svg'

import { TActivityStatus, TTimerStatus } from '@common/interfaces/timers'

export interface CountingClockProps {
    time: string
    Icon: React.FC<SvgProps>
    numberRounds?: number
    weatherActivityStatus?: TActivityStatus
    watchProgressStatus: TTimerStatus
    onPressPlayButton: () => void
    onPressEditButton: () => void
    onPressPauseButton: () => void
    onPressResetButton: () => void
}
