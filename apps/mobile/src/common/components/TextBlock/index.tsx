import { ITextBlock } from 'goal-models'
import { Text } from 'tamagui'

import InternalCard from '@components/InternalCard'

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
