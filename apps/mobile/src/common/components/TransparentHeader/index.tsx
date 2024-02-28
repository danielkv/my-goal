import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { LinearGradient } from 'expo-linear-gradient'
import { Text, XStack, getTokens } from 'tamagui'

import Button from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { ChevronLeft } from '@tamagui/lucide-icons'

interface TransparentHeaderProps {
    title?: string
}
const TransparentHeader: React.FC<TransparentHeaderProps> = ({ title }) => {
    const { goBack } = useNavigation()
    const insets = useSafeAreaInsets()
    const { space } = getTokens()

    return (
        <LinearGradient
            colors={['rgba(30,30,30,1)', 'transparent']}
            style={{
                zIndex: 999,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                paddingTop: insets.top,
                paddingBottom: space[6].val,
            }}
        >
            <XStack p="$2" ai="center">
                <Button
                    onPress={() => {
                        goBack()
                    }}
                    size="$3"
                    circular
                    transparent
                    icon={<ChevronLeft size={26} />}
                    pressStyle={{ bg: 'rgba(0,0,0,0.1)' }}
                />
                <Text fontWeight="bold" fontSize="$6" f={1} ta="center" mr={30}>
                    {title}
                </Text>
            </XStack>
        </LinearGradient>
    )
}

export default TransparentHeader
