import { useRef, useState } from 'react'
import { TextInput } from 'react-native'

import dayjs from 'dayjs'
import { Input, InputProps, Text, XStack } from 'tamagui'

export interface TimeFieldProps {
    value: number
    onChange: (value: number) => void
    variant?: 'dark' | 'default'
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

const TimeField: React.FC<TimeFieldProps> = ({ value, onChange, variant }) => {
    const splittedTime = splitTime(value)
    const isDark = variant === 'dark'

    const minuteRef = useRef<TextInput>(null)
    const secondRef = useRef<TextInput>(null)

    const [minutes, setMinutes] = useState(() => splittedTime[0])
    const [seconds, setSeconds] = useState(() => splittedTime[1])

    const handleChange = (input: 'minutes' | 'seconds') => (value: string) => {
        const m = input === 'minutes' ? value : minutes
        const s = input === 'seconds' ? value : seconds

        if (input === 'minutes') {
            setMinutes(m)
            if (m.length >= 2) handleSelectSeconds()
        } else {
            setSeconds(s)
        }

        const secondsFinal = stringTimeToSeconds(`${m}:${s}`)
        onChange(secondsFinal)
    }

    const style: InputProps = isDark
        ? {
              unstyled: true,
              color: '$gray2',
              fontSize: 60,
              ta: 'center',
              fontWeight: '700',
              w: 100,
          }
        : {
              unstyled: true,
              color: '$gray9',
              fontSize: 16,
          }

    const handleSelectMinutes = () => {
        minuteRef.current?.focus()
        minuteRef.current?.setNativeProps({ selection: { start: 0, end: 2 } })
    }
    const handleSelectSeconds = () => {
        secondRef.current?.focus()
        secondRef.current?.setNativeProps({ selection: { start: 0, end: 2 } })
    }

    return (
        <XStack
            alignItems="center"
            bg={isDark ? '$gray8' : 'white'}
            br="$4"
            p="$1"
            px={isDark ? '$1' : '$3.5'}
            h={isDark ? '$0' : 45}
            onPress={handleSelectMinutes}
        >
            <Input
                ref={minuteRef}
                keyboardType="number-pad"
                onBlur={() => {
                    setMinutes((prev) => dayjs.duration(Number(prev), 'minute').format('mm'))
                    setSeconds((prev) => dayjs.duration(Number(prev), 'seconds').format('ss'))
                }}
                onFocus={handleSelectMinutes}
                maxLength={2}
                value={minutes}
                onChangeText={handleChange('minutes')}
                {...style}
            />
            <Text
                fontWeight={isDark ? 'bold' : '500'}
                fontSize={isDark ? '$8' : 16}
                color={isDark ? 'white' : '$gray9'}
            >
                :
            </Text>
            <Input
                ref={secondRef}
                keyboardType="number-pad"
                onBlur={() => {
                    setSeconds((prev) => dayjs.duration(Number(prev), 'seconds').format('ss'))
                }}
                onFocus={handleSelectSeconds}
                maxLength={2}
                value={seconds}
                onChangeText={handleChange('seconds')}
                {...style}
            />
        </XStack>
    )
}

export default TimeField
