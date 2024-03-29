import { useMemo } from 'react'
import PagerView from 'react-native-pager-view'
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useEvent,
    useHandler,
    useSharedValue,
} from 'react-native-reanimated'

import { IBlock, IDayModel } from 'goal-models'
import { ScrollView, Stack, XStack, getTokens } from 'tamagui'

import { IFlatSection } from '@common/interfaces/worksheet'
import BlockItem from '@components/BlockItem'
import WodCard from '@components/WodCard'

export interface SectionCarouselView {
    day: IDayModel
    onBlockPress: (block: IBlock) => void
}

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

const SectionCarouselView: React.FC<SectionCarouselView> = ({ day, onBlockPress }) => {
    const { size } = getTokens()

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

    const sections = useMemo(
        () =>
            day?.periods?.flatMap<IFlatSection>((periods, periodIndex) =>
                periods.sections.map((section, sectionIndex) => ({
                    period: periodIndex + 1,
                    sectionNumber: sectionIndex + 1,
                    ...section,
                }))
            ) || [],
        []
    )

    return (
        <Stack fg={1} pt="$6">
            <XStack jc="center" mb="$6">
                {sections.map((item, index) => {
                    const animatedValue = useDerivedValue(() => {
                        const realOffset =
                            index === previous.value ? 1 - offset.value : index === next.value ? offset.value : 0

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
                            key={`dot.${item.name}.${index}`}
                            style={[
                                { width: 8, height: 8, marginHorizontal: 4, borderRadius: 4, backgroundColor: 'white' },
                                handlerStyle,
                            ]}
                        />
                    )
                })}
            </XStack>
            <AnimatedPagerView style={{ flex: 1 }} onPageScroll={scrollHandler}>
                {sections.map((item, index) => {
                    const sectionNumber = `${item.period}.${item.sectionNumber}`
                    return (
                        <Stack key={`${item.name}.${index}`}>
                            <ScrollView
                                contentContainerStyle={{
                                    paddingHorizontal: size['1'].val,
                                }}
                            >
                                <WodCard title={item.name} number={sectionNumber}>
                                    <Stack gap="$2">
                                        {item.blocks.map((block, index) => (
                                            <BlockItem
                                                key={`${block.type}.${index}`}
                                                block={block}
                                                blockNumber={`${sectionNumber}.${index + 1}`}
                                                onPress={onBlockPress}
                                            />
                                        ))}
                                    </Stack>
                                </WodCard>
                            </ScrollView>
                        </Stack>
                    )
                })}
            </AnimatedPagerView>
        </Stack>
    )
}

export default SectionCarouselView
