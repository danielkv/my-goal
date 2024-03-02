import React, { useCallback, useState } from 'react'
import { Alert, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import RenderHtml, { CustomTextualRenderer } from 'react-native-render-html'

import dayjs from 'dayjs'
import { getYoutubeVideoThumbnail, pluralize } from 'goal-utils'
import useSWR from 'swr'
import { Image, Sheet, Stack, Text, XStack, YStack } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import Button from '@components/Button'
import VideoPlayer from '@components/VideoPlayer'
import { RouteProp, StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName, TReactNavigationStackParamList } from '@router/types'
import { ChevronDown, ChevronUp, Eye, EyeOff } from '@tamagui/lucide-icons'
import { getGroupByIdUseCase } from '@useCases/programs/getGroupById'
import { toggleGroupWatchedUseCase } from '@useCases/programs/toggleGroupWatched'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const MentionRenderer: CustomTextualRenderer = ({ TDefaultRenderer, ...props }) => {
    const { navigate } = useNavigation()
    const attrs = (props.tnode as any).init.domNode.attribs as Record<string, string>

    if (attrs['class'] === 'mention-movement' && attrs['data-mention-uuid'])
        return (
            <TDefaultRenderer
                {...props}
                style={{ backgroundColor: 'rgb(201, 255, 201)', color: '#333' }}
                onPress={() =>
                    navigate(ERouteName.ProgramMovementScreen, {
                        movementId: attrs['data-mention-uuid'],
                        title: attrs.label,
                    })
                }
            />
        )

    return <TDefaultRenderer {...props} />
}

const MIN_SHEET_HEIGHT = 80

const ProgramGroupScreen: React.FC = () => {
    const { navigate, dispatch, setOptions } = useNavigation()

    const user = usePreventAccess()
    const [position, setPosition] = useState(1)
    const [fullscreen, setFullscreen] = useState(false)

    const [loadingMarkAsWatched, setLoadingMarkAsWatched] = useState(false)

    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'ProgramGroupScreen'>>()

    useFocusEffect(
        useCallback(() => {
            if (!params.title || !params.groupId) return dispatch(StackActions.replace(ERouteName.ProgramList))
            setOptions({ title: params.title })
        }, [params])
    )

    const { data, isLoading, error, mutate } = useSWR(
        () => (params.groupId ? ['programMovementList', params.groupId] : null),
        (args) => getGroupByIdUseCase(args[1])
    )

    const handleToggleGroupWatched = async () => {
        if (!data?.id || !user) return
        try {
            setLoadingMarkAsWatched(true)
            await toggleGroupWatchedUseCase(user.id, data.id)

            await mutate()
        } catch (err) {
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        } finally {
            setLoadingMarkAsWatched(false)
        }
    }

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if (!data && isLoading)
        return (
            <Stack flex={1} alignItems="center" justifyContent="center">
                <ActivityIndicator />
            </Stack>
        )

    return (
        <>
            <ScrollView
                bounces={!fullscreen}
                overScrollMode="never"
                contentContainerStyle={{ paddingBottom: fullscreen ? 0 : MIN_SHEET_HEIGHT }}
            >
                <Stack>
                    {!!data?.video && (
                        <VideoPlayer
                            videoUrl={data.video}
                            maxWidth={Dimensions.get('screen').width}
                            maxHeight={Dimensions.get('screen').height}
                            onFullScreenChange={(orientation) => {
                                if (orientation === 'portrait') setOptions({ headerShown: true })
                                else setOptions({ headerShown: false })

                                setFullscreen(orientation === 'landscape')
                            }}
                        />
                    )}
                    {!fullscreen && (
                        <Stack m="$6" gap="$4">
                            <RenderHtml
                                contentWidth={Dimensions.get('screen').width}
                                source={{ html: data?.text || '' }}
                                tagsStyles={tagStyles}
                                renderers={{
                                    span: MentionRenderer,
                                }}
                            />
                            <Stack gap="$3">
                                <Button
                                    loading={loadingMarkAsWatched}
                                    variant={data?.watched_at ? 'outlined' : 'primary'}
                                    onPress={() => handleToggleGroupWatched()}
                                    icon={!data?.watched_at ? <Eye /> : <EyeOff />}
                                >
                                    {data?.watched_at ? 'Marcar como não visto' : 'Marcar como visto'}
                                </Button>
                                {data?.watched_at && (
                                    <Text ta="center">Visto dia {dayjs(data.watched_at).format('DD/MM/YY')}</Text>
                                )}
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </ScrollView>
            {!fullscreen && !!data?.movements.length && (
                <>
                    <Sheet
                        modal={false}
                        native
                        forceRemoveScrollEnabled={true}
                        open
                        dismissOnOverlayPress={false}
                        snapPointsMode="mixed"
                        snapPoints={['90%', MIN_SHEET_HEIGHT]}
                        position={position}
                        onPositionChange={setPosition}
                        zIndex={100_000}
                    >
                        <Sheet.Handle bg="$gray4" />
                        <Sheet.Frame padding="$4">
                            <Button
                                br={0}
                                icon={position === 0 ? ChevronDown : ChevronUp}
                                onPress={() => setPosition((current) => (current === 1 ? 0 : 1))}
                            >
                                {position === 0
                                    ? ''
                                    : `${data.movements.length} ${pluralize(data.movements.length, 'movimento')}`}
                            </Button>
                            <Sheet.ScrollView f={1}>
                                <YStack my="$3" gap="$2">
                                    {data.movements.map((movement) => {
                                        const videoUrl = movement.movement.video

                                        const thumbnail = videoUrl && getYoutubeVideoThumbnail(videoUrl)

                                        if (!thumbnail) return <Text>Sem vídeo</Text>

                                        return (
                                            <TouchableOpacity
                                                key={movement.id}
                                                onPress={() =>
                                                    navigate(ERouteName.ProgramMovementScreen, {
                                                        movementId: movement.movement_id,
                                                        title: movement.movement.movement,
                                                    })
                                                }
                                            >
                                                <XStack ai="center" gap="$2">
                                                    <Image source={{ uri: thumbnail }} width={80} height={60} />
                                                    <Text fontWeight="bold" fontSize="$5">
                                                        {movement.movement.movement}
                                                    </Text>
                                                </XStack>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </YStack>
                            </Sheet.ScrollView>
                        </Sheet.Frame>
                    </Sheet>
                </>
            )}
        </>
    )
}

const tagStyles = {
    body: {
        color: 'white',
    },
    h1: {
        fontSize: '1.5em',
    },
    h2: {
        fontSize: '1.2em',
    },
    ul: { margin: 0, marginLeft: 7, paddingLeft: 5 },
    li: { margin: 0 },
    p: { margin: 0, marginBottom: 8 },
}

export default ProgramGroupScreen
