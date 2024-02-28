import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, TouchableHighlight, View } from 'react-native'
import RenderHtml from 'react-native-render-html'
import YoutubePlayer, { PLAYER_STATES, YoutubeIframeRef } from 'react-native-youtube-iframe'

import dayjs from 'dayjs'
import * as ScreenOrientation from 'expo-screen-orientation'
import { getYoutubeVideoId } from 'goal-utils'
import useSWR from 'swr'
import { ScrollView, Slider, Stack, Text } from 'tamagui'

import { useOrientation } from '@common/hooks/useOrientation'
import { TOrientation } from '@common/interfaces/app'
import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import Button from '@components/Button'
import { RouteProp, StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName, TReactNavigationStackParamList } from '@router/types'
import { getClassByIdUseCase } from '@useCases/programs/getClassById'
import { toggleClassWatchedUseCase } from '@useCases/programs/toggleClassWatched'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

function getVideoSize(orientation: TOrientation): [number, number] {
    const screenW = Dimensions.get('screen').width
    const screenH = Dimensions.get('screen').height
    const aspectRatio = 16 / 9

    if (orientation === 'landscape') return [screenH * aspectRatio, screenH]

    return [screenW, screenW / aspectRatio]
}

const ProgramClassScreen: React.FC = () => {
    const { dispatch, setOptions } = useNavigation()
    const [loadingMarkAsWatched, setLoadingMarkAsWatched] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [loadingVideo, setLoadingVideo] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [[videoWidth, videoHeight], setVideoSize] = useState<[number, number]>(getVideoSize('portrait'))

    const videoRef = useRef<YoutubeIframeRef>(null)
    const sliderTimerRef = useRef<NodeJS.Timeout>()

    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'ProgramClassScreen'>>()

    const user = usePreventAccess()

    const orientation = useOrientation()

    useFocusEffect(
        useCallback(() => {
            if (!params.title || !params.classId) return dispatch(StackActions.replace(ERouteName.ProgramList))
            setOptions({ title: params.title })
        }, [params])
    )

    useEffect(() => {
        if (orientation === 'portrait') setOptions({ headerShown: true })
        else setOptions({ headerShown: false })

        setVideoSize(getVideoSize(orientation))
    }, [orientation])

    useEffect(() => {
        ScreenOrientation.unlockAsync()

        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        }
    }, [])

    useEffect(() => {
        if (!playing) {
            if (sliderTimerRef.current) clearTimeout(sliderTimerRef.current)
            return
        }

        async function currentTimeHandler() {
            const currentTime = await videoRef.current?.getCurrentTime()
            if (currentTime !== undefined) setCurrentTime(currentTime)

            sliderTimerRef.current = setTimeout(() => {
                currentTimeHandler()
            }, 50)
        }

        currentTimeHandler()

        return () => {
            if (sliderTimerRef.current) clearTimeout(sliderTimerRef.current)
        }
    }, [playing])

    const { data, isLoading, error, mutate } = useSWR(
        () => (params.title && params.classId ? ['classItem', params.classId] : null),
        (args) => getClassByIdUseCase(args[1])
    )

    const handleSeekTo = (time: number) => {
        videoRef.current?.seekTo(time, true)
    }

    const handleVideoChangeState = (ev: PLAYER_STATES) => {
        switch (ev) {
            case PLAYER_STATES.ENDED:
            case PLAYER_STATES.PAUSED:
                setPlaying(false)
                break
            case PLAYER_STATES.PLAYING:
                videoRef.current?.getDuration().then((duration) => setDuration(duration))
                break
        }
    }

    const handleToggleClassWatched = async () => {
        if (!data?.id || !user) return
        try {
            setLoadingMarkAsWatched(true)
            await toggleClassWatchedUseCase(user.id, data.id, !data.watched_at)

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

    const videoId = data?.video ? getYoutubeVideoId(data?.video) : null

    if (!videoId) return <AlertBox type="error" text="Video não tem ID" />

    return (
        <ScrollView bounces={orientation === 'portrait'}>
            <Stack position="relative">
                <View pointerEvents="none">
                    <YoutubePlayer
                        ref={videoRef}
                        play={playing}
                        width={videoWidth}
                        height={videoHeight}
                        videoId={videoId}
                        initialPlayerParams={{ controls: false, modestbranding: true, loop: true }}
                        onReady={() => setLoadingVideo(false)}
                        onChangeState={handleVideoChangeState}
                        allowWebViewZoom={false}
                    />
                </View>
                <TouchableHighlight
                    style={{
                        zIndex: 999,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                    underlayColor="transparent"
                    onPress={() => setPlaying((current) => !current)}
                >
                    <Stack w={videoWidth} h={videoHeight} jc="flex-end" px="$2">
                        {loadingVideo && (
                            <Stack f={1} ai="center" jc="center">
                                <ActivityIndicator />
                            </Stack>
                        )}

                        <Slider
                            size="$1"
                            value={[currentTime]}
                            onValueChange={(newValue) => {
                                setCurrentTime(newValue[0])
                                handleSeekTo(newValue[0])
                            }}
                            max={duration}
                            min={1}
                            step={1}
                        >
                            <Slider.Track>
                                <Slider.TrackActive bg="$red8" />
                            </Slider.Track>
                            <Slider.Thumb circular index={0} size="$1" />
                        </Slider>
                    </Stack>
                </TouchableHighlight>
            </Stack>
            {orientation === 'portrait' && (
                <Stack m="$6" gap="$4">
                    <RenderHtml
                        contentWidth={Dimensions.get('screen').width}
                        source={{ html: data?.text || '' }}
                        tagsStyles={tagStyles}
                    />
                    <Stack gap="$3">
                        <Button
                            loading={loadingMarkAsWatched}
                            variant={data?.watched_at ? 'outlined' : 'primary'}
                            onPress={() => handleToggleClassWatched()}
                        >
                            {data?.watched_at ? 'Clique para desmarcar' : 'Marcar como lido'}
                        </Button>
                        {data?.watched_at && (
                            <Text ta="center">Visto dia {dayjs(data.watched_at).format('DD/MM/YY')}</Text>
                        )}
                    </Stack>
                </Stack>
            )}
        </ScrollView>
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

export default ProgramClassScreen
