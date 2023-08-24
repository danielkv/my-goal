import dayjs from 'dayjs'
import { IUserData, IWorkoutResult } from 'goal-models'
import { displayResultValue } from 'goal-utils'
import { Text, XStack, YStack } from 'tamagui'

import Avatar from '@components/Avatar'
import { Lock } from '@tamagui/lucide-icons'

interface UserResultItemProps {
    user: IUserData
    result: IWorkoutResult
    isPrivate: boolean
    date: string
}

const UserResultItem = XStack.styleable<UserResultItemProps>(({ user, result, isPrivate, date, ...props }, ref) => {
    return (
        <XStack ref={ref} ai="center" jc="space-between" {...props}>
            <XStack ai="center" gap="$2">
                <Avatar image={user.photoURL} displayName={user.displayName} size={36} />
                <YStack>
                    <XStack ai="center" gap="$1">
                        <Text fontWeight="700" fontSize={16}>
                            {displayResultValue(result.type, result.value)}
                        </Text>
                        {isPrivate && <Lock size={12} color="$gray5" />}
                    </XStack>
                    <Text fontSize={12} color="$gray4">
                        {user.displayName}
                    </Text>
                </YStack>
            </XStack>
            <Text fontSize={13} color="$gray3">
                {dayjs(date).format('DD/MM/YY')}
            </Text>
        </XStack>
    )
})

export default UserResultItem
