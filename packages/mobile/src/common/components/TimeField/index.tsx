import { useState } from 'react'

import dayjs from 'dayjs'
import { Input, InputProps, Text, XStack } from 'tamagui'

export interface TimeFieldProps {
    value: number
    onChange: (value: number) => void
}

function splitTime(time: number): [string, string] {
    const duration = dayjs.duration(time, 'seconds')

    return [duration.format('mm'), duration.format('ss')]
}

export function stringTimeToSeconds(string: string): number {
    const splited = string.split(':')
    const minutes = Number(splited[0])
    const seconds = Number(splited[1])

    if (Number.isNaN(minutes) || Number.isNaN(seconds)) return 0

    const duration = dayjs.duration({ minutes, seconds })

    return duration.asSeconds()
}

const TimeField: React.FC<TimeFieldProps> = ({ value, onChange }) => {
    const splittedTime = splitTime(value)

    const [minutes, setMinutes] = useState(() => splittedTime[0])
    const [seconds, setSeconds] = useState(() => splittedTime[1])

    const handleChange = (input: 'minutes' | 'seconds') => (value: string) => {
        const m = input === 'minutes' ? value : minutes
        const s = input === 'seconds' ? value : seconds

        if (input === 'minutes') {
            setMinutes(m)
        } else {
            setSeconds(s)
        }

        const secondsFinal = stringTimeToSeconds(`${m}:${s}`)
        onChange(secondsFinal)
    }

    const style: InputProps = {
        unstyled: true,
        color: '$gray2',
        fontSize: 60,
        ta: 'center',
        fontWeight: '700',
        w: 100,
    }

    return (
        <XStack alignItems="center" bg="$gray8" br="$4" p="$1">
            <Input
                keyboardType="number-pad"
                onBlur={() => {
                    setMinutes((prev) => dayjs.duration(Number(prev), 'minute').format('mm'))
                    setSeconds((prev) => dayjs.duration(Number(prev), 'seconds').format('ss'))
                }}
                maxLength={2}
                value={minutes}
                onChangeText={handleChange('minutes')}
                {...style}
            />
            <Text fontWeight="bold" fontSize="$8">
                :
            </Text>
            <Input
                keyboardType="number-pad"
                onBlur={() => {
                    setSeconds((prev) => dayjs.duration(Number(prev), 'seconds').format('ss'))
                }}
                maxLength={2}
                value={seconds}
                onChangeText={handleChange('seconds')}
                {...style}
            />
        </XStack>
    )
}

export default TimeField
