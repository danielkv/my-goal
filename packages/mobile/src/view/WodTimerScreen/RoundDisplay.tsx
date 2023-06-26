import { memo } from 'react'

import { IRound } from '@models/block'
import { roundTransformer } from '@utils/transformer/round'

import { Stack, Text } from 'tamagui'
import { YStack } from 'tamagui'

export interface IRoundDisplayProps {
    rounds: IRound[]
    selected: number
}

const ITEM_HEIGHT = 18
const DISPLAY_NUMBER = 3
const ITEM_GAP = 6

const ITEM_MOVE_SIZE = ITEM_HEIGHT + ITEM_GAP

const RoundDisplay: React.FC<IRoundDisplayProps> = ({ rounds, selected }) => {
    const position = -ITEM_MOVE_SIZE * selected

    return (
        <Stack h={DISPLAY_NUMBER * ITEM_HEIGHT * 1.2} ai="center" jc="center">
            <Stack h={ITEM_MOVE_SIZE} bg="$gray9" br="$4" w="$13" />
            <YStack
                animation="quick"
                gap={ITEM_GAP}
                position="absolute"
                top={ITEM_MOVE_SIZE}
                transform={[{ translateY: position }]}
            >
                {rounds.map((round, currentIndex) => {
                    const isSelected = selected === currentIndex

                    const display =
                        round.type === 'rest'
                            ? roundTransformer.displayRestRound(round)
                            : roundTransformer.displayShortTitle(round)

                    return (
                        <Text
                            key={`${display}.${currentIndex}`}
                            animation="quick"
                            fontSize="$5"
                            fontWeight={isSelected ? '700' : '400'}
                            ta="center"
                            lineHeight={ITEM_HEIGHT}
                            color={isSelected ? 'white' : '$gray4'}
                        >
                            {display}
                        </Text>
                    )
                })}
            </YStack>
        </Stack>
    )
}

export default memo(RoundDisplay, (prev, next) => prev.selected === next.selected)
