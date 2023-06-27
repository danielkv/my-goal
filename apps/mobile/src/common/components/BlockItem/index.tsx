import RestBlock from '@components/RestBlock'
import TextBlock from '@components/TextBlock'
import { IBlock } from 'goal-models'

import EventBlock from '../EventBlock'

export interface BlockProps {
    block: IBlock
}

const BlockItem: React.FC<BlockProps> = ({ block }) => {
    switch (block.type) {
        case 'event':
            return <EventBlock block={block} />
        case 'rest':
            return <RestBlock block={block} />
        case 'text':
            return <TextBlock block={block} />
    }

    return null
}

export default BlockItem
