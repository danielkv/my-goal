import { SvgProps } from 'react-native-svg'

import Button from '@components/Button'

import { Stack, Text, YStack } from 'tamagui'

interface TimerCardProps {
    onPress: () => void
    title?: string
    Icon: React.FC<SvgProps>
}

const TimerCard: React.FC<TimerCardProps> = ({ title: description, Icon, ...rest }) => {
    return (
        <Stack flex={1} ac="center" jc="center">
            <Button br="$4" w="auto" h="auto" bg="$gray6" pressStyle={{ bg: '$gray8' }} py="$7" {...rest}>
                <YStack ac="center" ai="center">
                    <Icon fill="white" />

                    <Text mt="$5" fontSize="$3" color="$gray2" fontWeight="700">
                        {description}
                    </Text>
                </YStack>
            </Button>
        </Stack>
    )
}

export default TimerCard
