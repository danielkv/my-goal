import { Children, PropsWithChildren, useRef, useState } from 'react'
import PagerView from 'react-native-pager-view'
import Animated, { useSharedValue } from 'react-native-reanimated'

import { Dialog, XStack, YStack } from 'tamagui'

import { useStorage } from '@common/hooks/useStorage'
import Button from '@components/Button'
import PaginationDots from '@components/PaginationDots'
import { usePageScrollHandler } from '@hooks/helpers/usePageScrollHandler'
import { Check, ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)

interface OnboardingProps {
    id: string
}

const Onboarding: React.FC<PropsWithChildren<OnboardingProps>> = ({ children, id }) => {
    const [currentPage, setCurrentPage] = useState(0)

    const pagerViewRef = useRef<PagerView>(null)
    const pagesLength = Children.count(children)

    const { currentValue, loading, setItem } = useStorage(id, 'show')

    const offset = useSharedValue(0)
    const position = useSharedValue(0)

    const scrollHandler = usePageScrollHandler({
        onPageScroll: (e: any) => {
            'worklet'
            offset.value = e.offset
            position.value = e.position
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
                            <PaginationDots length={pagesLength} position={position} offset={offset} />
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
