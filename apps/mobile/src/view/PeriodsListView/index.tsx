import { useCallback } from 'react'

import BlockItem from '@components/BlockItem'
import WodCard from '@components/WodCard'
import { useLoggedUser } from '@contexts/user/userContext'
import { IDayModel } from '@models/day'
import { StackActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { FlashList } from '@shopify/flash-list'

import dayjs from 'dayjs'
import { Stack, Text, YStack, getTokens } from 'tamagui'
import { useTheme } from 'tamagui'

export interface PeriodsListView {
    day: IDayModel
}

const PeriodsListView: React.FC<PeriodsListView> = ({ day }) => {
    const theme = useTheme()
    const { size } = getTokens()

    const { dispatch } = useNavigation()
    const user = useLoggedUser()

    useFocusEffect(
        useCallback(() => {
            if (!user) dispatch(StackActions.replace(ERouteName.LoginScreen))
        }, [user])
    )

    return (
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
                                            {section.blocks.map((block, blockNumber) => {
                                                const blockNumberId = `${sectionNumberId}.${blockNumber + 1}`
                                                return (
                                                    <Stack key={`${block.type}.${blockNumber}`}>
                                                        <Stack mb="$2">
                                                            <BlockItem
                                                                key={`${block.type}.${blockNumber}`}
                                                                block={block}
                                                            />
                                                        </Stack>
                                                        <Stack
                                                            px="$2"
                                                            py="$1"
                                                            btlr="$2"
                                                            btrr="$2"
                                                            bg="$gray5"
                                                            position="absolute"
                                                            bottom={0}
                                                            right="$3"
                                                        >
                                                            <Text fontSize="$3">{blockNumberId}</Text>
                                                        </Stack>
                                                    </Stack>
                                                )
                                            })}
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
                backgroundColor: theme.gray7.val,
            }}
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={640}
        />
    )
}

export default PeriodsListView
