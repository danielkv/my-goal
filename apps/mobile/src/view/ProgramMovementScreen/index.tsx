import { useCallback, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'

import useSWR from 'swr'
import { ScrollView, Stack } from 'tamagui'

import { useOrientation } from '@common/hooks/useOrientation'
import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import VideoPlayer from '@components/VideoPlayer'
import { RouteProp, StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName, TReactNavigationStackParamList } from '@router/types'
import { getMovimentByIdUseCase } from '@useCases/programs/getMovementById'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const ProgramMovementScreen: React.FC = () => {
    usePreventAccess()

    const orientation = useOrientation()

    const { dispatch, setOptions } = useNavigation()

    const [fullscreen, setFullscreen] = useState(false)

    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'ProgramMovementScreen'>>()

    useFocusEffect(
        useCallback(() => {
            if (!params.movementId) return dispatch(StackActions.replace(ERouteName.ProgramList))
            if (params.title) setOptions({ title: params.title })
        }, [params])
    )

    const { data, isLoading, error } = useSWR(
        () => (params.title && params.movementId ? ['classItem', params.movementId] : null),
        (args) => getMovimentByIdUseCase(args[1])
    )

    useEffect(() => {
        if (!params.title && data) setOptions({ title: data.movement })
    }, [data])

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if (!data && isLoading)
        return (
            <Stack flex={1} alignItems="center" justifyContent="center">
                <ActivityIndicator />
            </Stack>
        )

    return (
        <ScrollView bounces={orientation === 'portrait'}>
            {data?.video && (
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
                    />
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

export default ProgramMovementScreen
