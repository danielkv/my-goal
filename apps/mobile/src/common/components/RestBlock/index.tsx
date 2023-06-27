import { IRestBlock } from 'goal-models'
import { getTimeFromSeconds } from 'goal-utils'
import { Text } from 'tamagui'

import InternalCard from '@components/InternalCard'

export interface RestBlockProps {
    block: IRestBlock
}

const RestBlock: React.FC<RestBlockProps> = ({ block }) => {
    return (
        <InternalCard>
            <Text fontSize="$4">{`${getTimeFromSeconds(block.time)} Rest`}</Text>
            {!!block.text && (
                <Text fontSize="$4" color="$gray3">
                    {block.text}
                </Text>
            )}
        </InternalCard>
    )
}

export default RestBlock
