import Button from '@components/Button'

import { Text, YStack } from 'tamagui'

export interface MenuButtonProps {
    Icon: React.ElementType<any>
    label: string
    onPress?(): void
}

const MenuButton: React.FC<MenuButtonProps> = ({ Icon, label, onPress }) => {
    return (
        <Button variant="transparent" pressStyle={{ bg: '$gray7' }} h="auto" w="auto" px="$5" py="$1" onPress={onPress}>
            <YStack ai="center" jc="center">
                <Icon />
                <Text fontSize={10} color="$gray5">
                    {label}
                </Text>
            </YStack>
        </Button>
    )
}

export default MenuButton
