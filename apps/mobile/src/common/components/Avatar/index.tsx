import { getContrastColor, stringToColor, userInitials } from 'goal-utils'
import { Avatar as AvatarTamagui, AvatarProps as AvatarTamaguiProps, Text, styled } from 'tamagui'

export interface AvatarProps {
    image: string | undefined | null
    displayName?: string
    size?: number
}

const Avatar = styled(AvatarTamagui)

export default Avatar.styleable<AvatarProps>(({ image, displayName, ...rest }, ref) => {
    const avatarColor = displayName ? stringToColor(displayName) : ''
    const textAvatarColor = getContrastColor(avatarColor)

    return (
        <AvatarTamagui bg={avatarColor} circular size="$10" ref={ref} {...(rest as AvatarTamaguiProps)}>
            {image && <AvatarTamagui.Image source={{ uri: image }} />}
            <AvatarTamagui.Fallback bg={avatarColor} ai="center" jc="center">
                <Text
                    fontSize={rest.size ? rest.size / 2.5 : '$10'}
                    textAlign="center"
                    fontWeight="800"
                    color={textAvatarColor}
                >
                    {userInitials(displayName)}
                </Text>
            </AvatarTamagui.Fallback>
        </AvatarTamagui>
    )
})
