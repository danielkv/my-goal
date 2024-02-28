import dayjs from 'dayjs'
import { IUserProgram } from 'goal-models'
import { H5, Stack, Text, XStack, YStack } from 'tamagui'

import Button from '@components/Button'
import { FileSpreadsheet } from '@tamagui/lucide-icons'

export interface WorksheetListItemProps {
    item: IUserProgram

    onPress?: (item: IUserProgram) => void
}

const EXPIRATION_WARNING = 5

const ProgramListItem: React.FC<WorksheetListItemProps> = ({ item, onPress }) => {
    const expirationDate = dayjs(item.user_programs[0].expires_at).format('DD/MM/YYYY')

    const expirationClose = dayjs(item.user_programs[0].expires_at).diff(dayjs(), 'day') <= EXPIRATION_WARNING

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
                    <YStack f={1}>
                        <H5 fontWeight="700" lineHeight="$1" fontSize="$5" color="$gray1">
                            {item.name}
                        </H5>

                        <Text color={expirationClose ? '$yellow10' : '$gray3'} fontSize="$2" mt="$1">
                            Expira dia {expirationDate}
                        </Text>
                    </YStack>
                </XStack>
            </Button>
        </Stack>
    )
}

export default ProgramListItem
