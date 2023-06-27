import dayjs from 'dayjs'
import { IWorksheetModel } from 'goal-models'
import { Circle, H5, Stack, Text, XStack, YStack } from 'tamagui'

import Button from '@components/Button'
import { FileSpreadsheet } from '@tamagui/lucide-icons'

export interface WorksheetListItemProps {
    item: IWorksheetModel

    onPress?: (item: IWorksheetModel) => void
}

const WorksheetListItem: React.FC<WorksheetListItemProps> = ({ item, onPress }) => {
    const isCurrent = item.startEndDate
        ? dayjs().isBetween(item.startEndDate.start, item.startEndDate.end, 'day', '[]')
        : false

    const startEndDateDisplay = item.startEndDate
        ? `${dayjs(item.startEndDate.start).format('DD/MM/YYYY')} - ${dayjs(item.startEndDate.end).format(
              'DD/MM/YYYY'
          )}`
        : dayjs(item.startDate).format('DD/MM/YYYY')

    return (
        <Stack>
            <Button
                br="$4"
                w="auto"
                h="auto"
                bg="$gray9"
                elevation={3}
                pressStyle={{ bg: '$gray8' }}
                onPress={() => onPress?.(item)}
            >
                <XStack f={1} py="$4" ai="center" gap="$3">
                    <FileSpreadsheet size={24} color="$gray4" />
                    <YStack>
                        <H5 fontWeight="700" color="$gray1">
                            {item.name}
                        </H5>
                        <Text color="$gray3" fontSize="$2">
                            {startEndDateDisplay}
                        </Text>
                    </YStack>
                    {isCurrent && <Circle position="absolute" top="$3" right={0} bg="$red5" size={7} />}
                </XStack>
            </Button>
        </Stack>
    )
}

export default WorksheetListItem
