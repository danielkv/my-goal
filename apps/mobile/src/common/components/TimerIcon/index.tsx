import { SvgProps } from 'react-native-svg'

import { TTimerTypes } from 'goal-models'
import { ColorTokens, getTokens } from 'tamagui'

import EmomSvg from '@assets/svg/emom.svg'
import StopwatchSvg from '@assets/svg/stopwatch.svg'
import TabataSvg from '@assets/svg/tabata.svg'

type TAllowedTypes = Exclude<TTimerTypes, 'not_timed'>

const icons: Record<TAllowedTypes, React.FC<SvgProps>> = {
    emom: EmomSvg,
    for_time: StopwatchSvg,
    amrap: StopwatchSvg,
    tabata: TabataSvg,
}

interface TimerIconProps {
    size: number
    name: TAllowedTypes
    color: ColorTokens | string
}

const TimerIcon: React.FC<TimerIconProps> = ({ size, name, color: _color }) => {
    const { color: tokens } = getTokens()

    // @ts-expect-error
    const color = tokens[_color]?.val || _color

    const Icon = icons[name]

    return <Icon width={size} height={size} fill={color} />
}

export default TimerIcon
