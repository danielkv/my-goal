import dayjs from 'dayjs'
import { IBlock, IDayModel } from 'goal-models'
import { Stack, Text, YStack, getTokens } from 'tamagui'
import { useTheme } from 'tamagui'

import BlockItem from '@components/BlockItem'
import WodCard from '@components/WodCard'
import { FlashList } from '@shopify/flash-list'

export interface PeriodsListView {
    day: IDayModel
    onBlockPress: (block: IBlock) => void
}

const PeriodsListView: React.FC<PeriodsListView> = ({ day, onBlockPress }) => {
    const theme = useTheme()
    const { size } = getTokens()

    return (
        <>
            <FlashList
                data={day.periods}
                horizontal={false}
                ItemSeparatorComponent={() => <Stack bw={1} btc="$gray8" bbc="$gray6" my="$4" />}
                renderItem={({ item, index }) => {
                    const dateJs = dayjs(day.date)
                    const periodNumber = index + 1

                    return (
                        <WodCard title={dateJs.format('ddd[.] DD/MM/YYYY')} number={periodNumber.toString()}>
                            <Stack gap="$5">
                                {item.sections.map((section, sectionNumber) => {
                                    const sectionNumberId = `${periodNumber}.${sectionNumber + 1}`
                                    return (
                                        <YStack key={`${section.name}.${sectionNumber}`} f={1}>
                                            <Stack mb="$4">
                                                <Text textAlign="center" fontWeight="bold" textTransform="uppercase">
                                                    {sectionNumberId} {section.name}
                                                </Text>
                                            </Stack>
                                            <YStack gap="$2">
                                                {section.blocks.map((block, blockNumber) => (
                                                    <BlockItem
                                                        key={`${block.type}.${blockNumber}`}
                                                        block={block}
                                                        blockNumber={`${sectionNumberId}.${blockNumber + 1}`}
                                                        onPress={onBlockPress}
                                                    />
                                                ))}
                                            </YStack>
                                        </YStack>
                                    )
                                })}
                            </Stack>
                        </WodCard>
                    )
                }}
                contentContainerStyle={{
                    paddingVertical: size['1.5'].val,
                    paddingHorizontal: size['1'].val,
                    paddingBottom: size['6'].val,
                    backgroundColor: theme.gray7.val,
                }}
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={640}
            />
        </>
    )
}

export default PeriodsListView
