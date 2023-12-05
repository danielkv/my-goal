import Animated, { SharedValue, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated'

import { XStack } from 'tamagui'

interface PaginationDotsProps {
    length: number
    position: SharedValue<number>
    offset: SharedValue<number>
    dotMinSize?: number
    dotMaxSize?: number
}

const DOT_MIN = 0.4
const DOT_MAX = 1.4

const PaginationDots: React.FC<PaginationDotsProps> = ({
    length,
    offset,
    position,
    dotMinSize = DOT_MIN,
    dotMaxSize = DOT_MAX,
}) => {
    const DOT_DIFF = dotMaxSize - dotMinSize

    return (
        <XStack jc="center">
            {Array.from({ length }).map((_, index) => {
                const animatedValue = useDerivedValue(() => {
                    const isPrev = position.value === index
                    const isNext = position.value + 1 === index

                    const realOffset = isPrev ? 1 - offset.value : isNext ? offset.value : 0

                    return dotMinSize + DOT_DIFF * realOffset
                }, [offset, position])

                const handlerStyle = useAnimatedStyle(() => {
                    return {
                        transform: [{ scale: animatedValue.value }],
                        opacity: animatedValue.value,
                    }
                })

                return (
                    <Animated.View
                        key={index.toString()}
                        style={[
                            {
                                width: 8,
                                height: 8,
                                marginHorizontal: 4,
                                borderRadius: 4,
                                backgroundColor: 'white',
                            },
                            handlerStyle,
                        ]}
                    />
                )
            })}
        </XStack>
    )
}

export default PaginationDots
