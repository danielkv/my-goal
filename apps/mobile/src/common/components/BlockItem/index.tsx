import React from 'react'

import { IBlock } from 'goal-models'
import { Stack, Text } from 'tamagui'

import RestBlock from '@components/RestBlock'
import TextBlock from '@components/TextBlock'

import EventBlock from '../EventBlock'

export interface BlockProps {
    block: IBlock
    blockNumber: string
}

const blocks: Record<string, React.FC<any>> = {
    event: EventBlock,
    rest: RestBlock,
    text: TextBlock,
}

const BlockItem: React.FC<BlockProps> = ({ block, blockNumber }) => {
    const Block = blocks[block.type] as React.FC<{ block: IBlock }>

    return (
        <Stack>
            <Block block={block} />
            <Text textAlign="right" mt="$1" mr="$2" fontSize="$1" color="$gray5">
                {blockNumber}
            </Text>
        </Stack>
    )
}

export default BlockItem
