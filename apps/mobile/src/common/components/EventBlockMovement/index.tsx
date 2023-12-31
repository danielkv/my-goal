import * as Linking from 'expo-linking'
import { IEventMovement } from 'goal-models'
import { movementDisplay } from 'goal-utils'
import { Button, Stack, Text, XStack, useTheme } from 'tamagui'

import { Youtube } from '@tamagui/lucide-icons'

export interface EventBlockMovementProps {
    movement: IEventMovement
    hideReps: boolean
}

const EventBlockMovement: React.FC<EventBlockMovementProps> = ({ movement, hideReps }) => {
    const theme = useTheme()

    const displayMovement = movementDisplay.display(movement, hideReps)

    const handleOnClickUrl = () => {
        if (!movement.videoUrl) return
        Linking.openURL(movement.videoUrl)
    }

    return (
        <Stack>
            {movement.videoUrl ? (
                <XStack ai="center" gap="$2">
                    <Text color="$gray3" fontSize="$5">
                        {displayMovement}
                    </Text>
                    <Button size="$1.5" br="$6" w="$1.5" bg="$gray9" onPress={handleOnClickUrl}>
                        <Youtube size={14} color={theme.gray3.val} />
                    </Button>
                </XStack>
            ) : (
                <Text textBreakStrategy="balanced" fontSize="$5" color="$gray3">
                    {displayMovement}
                </Text>
            )}
        </Stack>
    )
}

export default EventBlockMovement
