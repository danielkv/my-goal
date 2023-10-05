import { IBlock } from 'goal-models'
import { Stack, Text } from 'tamagui'

import RestBlock from '@components/RestBlock'
import TextBlock from '@components/TextBlock'

import EventBlock from '../EventBlock'

export interface BlockProps {
    block: IBlock
    blockNumber: string
    onPress?(block: IBlock): void
}

const blocks: Record<string, React.FC<any>> = {
    event: EventBlock,
    rest: RestBlock,
    text: TextBlock,
}

const BlockItem: React.FC<BlockProps> = ({ block, blockNumber, onPress }) => {
    const Block = blocks[block.type] as React.FC<{ block: IBlock; onPress?(block: IBlock): void }>

    return (
        <Stack>
            <Block block={block} onPress={onPress} />
            <Text textAlign="right" mt="$1" mr="$2" fontSize="$1" color="$gray5">
                {blockNumber}
            </Text>
        </Stack>
    )
}

export default BlockItem
