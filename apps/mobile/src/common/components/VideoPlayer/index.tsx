import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, Platform, TouchableHighlight } from 'react-native'
import YoutubePlayer, { PLAYER_STATES, YoutubeIframeRef } from 'react-native-youtube-iframe'

import * as NavigationBar from 'expo-navigation-bar'
import * as ScreenOrientation from 'expo-screen-orientation'
import { setStatusBarHidden } from 'expo-status-bar'
import { getYoutubeVideoId } from 'goal-utils'
import { Slider, Stack, View } from 'tamagui'

import { useOrientation } from '@common/hooks/useOrientation'
import { TOrientation } from '@common/interfaces/app'
import AlertBox from '@components/AlertBox'

interface VideoPlayerProps {
    videoUrl: string
    maxWidth?: number
    maxHeight?: number
    onFullScreenChange?: (orientaion: TOrientation) => void
}

function getVideoSize(
    orientation: TOrientation,

    maxSize?: { maxWidth?: number; maxHeight?: number }
): [number, number] {
    const maxW = maxSize?.maxWidth || Dimensions.get('screen').width
    const maxH = maxSize?.maxHeight || Dimensions.get('screen').height
    const screenW = maxW
    const screenH = maxH
    const aspectRatio = 16 / 9

    if (orientation === 'landscape') return [screenH * aspectRatio, screenH]

    return [screenW, screenW / aspectRatio]
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, maxHeight, maxWidth, onFullScreenChange }) => {
    const orientation = useOrientation()

    const [playing, setPlaying] = useState(false)
    const [loadingVideo, setLoadingVideo] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [[videoWidth, videoHeight], setVideoSize] = useState<[number, number]>(() =>
        getVideoSize('portrait', { maxHeight, maxWidth })
    )

    const videoRef = useRef<YoutubeIframeRef>(null)
    const sliderTimerRef = useRef<NodeJS.Timeout>()

    const handleSeekTo = (time: number) => {
        videoRef.current?.seekTo(time, true)
    }

    useEffect(() => {
        setVideoSize(getVideoSize(orientation))
        onFullScreenChange?.(orientation)

        if (orientation === 'landscape') {
            if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('hidden')
            setStatusBarHidden(true, 'none')
        } else {
            if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('visible')
            setStatusBarHidden(false, 'none')
        }

        return () => {
            if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('visible')
            setStatusBarHidden(true, 'none')
        }
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

    const videoId = getYoutubeVideoId(videoUrl)
    if (!videoId) return <AlertBox type="error" text="Video não tem ID" />

    return (
        <Stack position="relative" ai="center">
            <View pointerEvents="none" height={videoHeight}>
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
                        mb="$2"
                    >
                        <Slider.Track>
                            <Slider.TrackActive bg="$red8" />
                        </Slider.Track>
                        <Slider.Thumb circular index={0} bg="$red9" bw={0} size={13} />
                    </Slider>
                </Stack>
            </TouchableHighlight>
        </Stack>
    )
}

export default VideoPlayer
