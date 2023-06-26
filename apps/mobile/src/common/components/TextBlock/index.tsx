import InternalCard from '@components/InternalCard'
import { ITextBlock } from '@models/block'

import { Text } from 'tamagui'

export interface TextBlockProps {
    block: ITextBlock
}

const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
    return (
        <InternalCard>
            <Text color="$gray1">{block.text}</Text>
        </InternalCard>
    )
}

export default TextBlock
