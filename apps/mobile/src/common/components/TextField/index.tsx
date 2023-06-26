import { Input, InputProps, Text, XStack, YStack } from 'tamagui'

interface TextFieldProps {
    label?: string
    error?: string
    componentLeft?: JSX.Element
    componentRight?: JSX.Element
}

const TextField = Input.styleable<TextFieldProps>(({ label, error, componentLeft, componentRight, ...props }, ref) => {
    return (
        <YStack space={2} w="100%">
            {label && (
                <Text fontSize="$3" color="$gray1">
                    {label}
                </Text>
            )}
            <XStack ai="center" gap="$1" h="$4" bg="white" br="$4" px="$2" py="$1">
                {componentLeft}
                <Input ref={ref} color="$gray6" px="$3" f={1} {...(props as InputProps)} unstyled />
                {componentRight}
            </XStack>
            {error && (
                <Text color="$red8Light" fontSize="$3" fontWeight="300">
                    {error}
                </Text>
            )}
        </YStack>
    )
})

export default TextField
