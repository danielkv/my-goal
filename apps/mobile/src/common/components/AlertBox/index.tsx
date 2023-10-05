import { ColorTokens, Dialog, Stack, XStack, YStack } from 'tamagui'

import { AlertTriangle, CheckCircle, Info, XCircle } from '@tamagui/lucide-icons'

type TAlertType = 'error' | 'success' | 'warning' | 'info'
type TAlertColor = {
    bg: ColorTokens
    color: ColorTokens
    icon: JSX.Element
}

export interface IAlertBoxProps {
    type: TAlertType
    title?: string
    text: string
}

function getAlertType(type: TAlertType): TAlertColor {
    switch (type) {
        case 'warning':
            return {
                bg: '$yellow8Light',
                color: 'white',
                icon: <AlertTriangle size={16} color="yellow" />,
            }
        case 'success':
            return {
                bg: '$green8Light',
                color: 'white',
                icon: <CheckCircle size={16} color="green" />,
            }
        case 'info':
            return {
                bg: '$blue8Light',
                color: 'white',
                icon: <Info size={16} color="blue" />,
            }
        case 'error':
            return {
                bg: '$red2',
                color: 'white',
                icon: <XCircle size={16} color="red" />,
            }
    }
}

const AlertBox = Stack.styleable<IAlertBoxProps>(({ type, text, title, ...props }, ref) => {
    const typeObj = getAlertType(type)

    return (
        <Stack ref={ref} {...props}>
            <Dialog modal={false}>
                <Dialog.Content bg={typeObj.bg}>
                    <XStack jc="flex-start" gap="$2">
                        <Stack mt={title ? 11 : 5}>{typeObj.icon}</Stack>
                        <YStack>
                            {!!title && (
                                <Dialog.Title fontSize="$6" lineHeight="$3" fontWeight="600" color={typeObj.color}>
                                    {title}
                                </Dialog.Title>
                            )}
                            <Dialog.Description fontWeight="400" lineHeight="$1" mt="$4" color={typeObj.color}>
                                {text}
                            </Dialog.Description>
                        </YStack>
                    </XStack>
                </Dialog.Content>
            </Dialog>
        </Stack>
    )
})

export default AlertBox
