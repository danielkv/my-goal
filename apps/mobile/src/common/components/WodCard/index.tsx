import { Stack, Text, XStack, YStack } from 'tamagui'

export interface WorksheetDayItemProps {
    title: string
    number: string
}

const WodCard = Stack.styleable<WorksheetDayItemProps>(({ number, title, children, ...rest }, ref) => {
    return (
        <Stack f={1} ref={ref} bg="$gray9" br="$4" elevationAndroid={4} shadowRadius={7} shadowOpacity={0.6} {...rest}>
            <XStack ai="center" jc="space-between">
                <Stack btlr="$4" bbrr="$4" bg="$red5" w={55} h={55} ai="center" jc="center">
                    <Text color="white" fontWeight="900" fontSize="$7">
                        {number}
                    </Text>
                </Stack>

                <Text mr="$5" fontSize="$5" fontWeight="600">
                    {title}
                </Text>
            </XStack>
            <YStack py="$4" px="$3">
                {children}
            </YStack>
        </Stack>
    )
})

export default WodCard
