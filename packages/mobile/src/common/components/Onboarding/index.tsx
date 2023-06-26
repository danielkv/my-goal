import { Children, PropsWithChildren, useRef, useState } from 'react'
import PagerView from 'react-native-pager-view'
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useEvent,
    useHandler,
    useSharedValue,
} from 'react-native-reanimated'

import { useStorage } from '@common/hooks/useStorage'
import Button from '@components/Button'
import { Check, ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'

import { Dialog, XStack, YStack } from 'tamagui'

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)

function usePageScrollHandler(handlers: any, dependencies?: any) {
    const { context, doDependenciesDiffer } = useHandler(handlers, dependencies)
    const subscribeForEvents = ['onPageScroll']

    return useEvent(
        (event: any) => {
            'worklet'
            const { onPageScroll } = handlers
            if (onPageScroll && event.eventName.endsWith('onPageScroll')) {
                onPageScroll(event, context)
            }
        },
        subscribeForEvents,
        doDependenciesDiffer
    )
}

const DOT_MIN = 0.4
const DOT_MAX = 1.4
const DOT_DIFF = DOT_MAX - DOT_MIN

interface OnboardingProps {
    id: string
}

const Onboarding: React.FC<PropsWithChildren<OnboardingProps>> = ({ children, id }) => {
    const [currentPage, setCurrentPage] = useState(0)

    const pagerViewRef = useRef<PagerView>(null)
    const pagesLength = Children.count(children)

    const { currentValue, loading, setItem } = useStorage(id, 'show')

    const offset = useSharedValue(0)
    const previous = useSharedValue(0)
    const next = useSharedValue(1)

    const scrollHandler = usePageScrollHandler({
        onPageScroll: (e: any) => {
            'worklet'
            offset.value = e.offset
            previous.value = e.position
            next.value = e.position + 1
        },
    })

    const handlePrev = () => {
        if (currentPage > 0) pagerViewRef.current?.setPage(currentPage - 1)
    }
    const handleNext = () => {
        if (currentPage < pagesLength - 1) return pagerViewRef.current?.setPage(currentPage + 1)

        setItem('hide')
    }

    const handFinish = () => {
        setItem('hide')
    }

    return (
        <Dialog open={!loading && currentValue === 'show'}>
            <Dialog.Portal>
                <Dialog.Content
                    key="content"
                    bg="$gray6"
                    f={1}
                    w="100%"
                    animation="quick"
                    opacity={1}
                    scale={1}
                    enterStyle={{ scale: 0.7, opacity: 0 }}
                    exitStyle={{ scale: 0.7, opacity: 0 }}
                >
                    <AnimatedPagerView
                        ref={pagerViewRef}
                        style={{ flex: 1 }}
                        onPageScroll={scrollHandler}
                        onPageSelected={({ nativeEvent: { position } }) => setCurrentPage(position)}
                    >
                        {children}
                    </AnimatedPagerView>

                    <XStack ai="center" justifyContent="space-around">
                        <Button
                            pressStyle={{ bg: '$backgroundHover' }}
                            size="$6"
                            bg="transparent"
                            circular
                            icon={<ChevronLeft color="$gray5" size="$2" />}
                            onPress={handlePrev}
                        />

                        <YStack>
                            <XStack jc="center">
                                {Array.from({ length: pagesLength }).map((_, index) => {
                                    const animatedValue = useDerivedValue(() => {
                                        const realOffset =
                                            index === previous.value
                                                ? 1 - offset.value
                                                : index === next.value
                                                ? offset.value
                                                : 0

                                        return DOT_MIN + DOT_DIFF * realOffset
                                    }, [previous, next, offset])

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
                            <Button
                                mt="$3"
                                variant="transparent"
                                pressStyle={{ bg: '$backgroundHover' }}
                                onPress={handFinish}
                            >
                                Pular
                            </Button>
                        </YStack>

                        <Button
                            pressStyle={{ bg: '$backgroundHover' }}
                            size="$6"
                            bg="transparent"
                            circular
                            onPress={handleNext}
                            icon={currentPage >= pagesLength - 1 ? <Check size="$2" /> : <ChevronRight size="$2" />}
                        />
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    )
}

export default Onboarding
