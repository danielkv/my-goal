import InternalCard from '@components/InternalCard'
import { IRestBlock } from '@models/block'
import { getTimeFromSeconds } from '@utils/time'

import { Text } from 'tamagui'

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
