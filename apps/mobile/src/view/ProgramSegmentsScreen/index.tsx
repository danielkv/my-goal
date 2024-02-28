import { useCallback, useMemo, useState } from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'

import dayjs from 'dayjs'
import { Models } from 'goal-models'
import { isProgramSession } from 'goal-utils'
import useSWR from 'swr'
import { Stack, Text, XStack, getTokens, useTheme } from 'tamagui'
import { Image } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import TransparentHeader from '@components/TransparentHeader'
import { RouteProp, StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName, TReactNavigationStackParamList } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { getSegmentsByProgramIdUseCase } from '@useCases/programs/getSegmentsByProgramId'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const HEADER_MAX_HEIGHT = Dimensions.get('screen').height / 2.1
const EXPIRATION_WARNING = 5

const ProgramSegmentsScreen: React.FC = () => {
    const { navigate, dispatch } = useNavigation()

    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'ProgramSegments'>>()

    useFocusEffect(
        useCallback(() => {
            if (!params.program?.user_programs?.length) return dispatch(StackActions.replace(ERouteName.ProgramList))
        }, [params])
    )

    const theme = useTheme()
    const { space } = getTokens()
    usePreventAccess()

    const [currentPage, setCurrentPage] = useState(0)

    const { data, isLoading, error } = useSWR(
        () => (params.program ? ['segmentsList', params.program.id, currentPage, 10] : null),
        (args) => getSegmentsByProgramIdUseCase({ programId: args[1], page: args[2], pageSize: args[3] })
    )

    const listData = useMemo(
        () =>
            data?.items.reduce<(Models<'program_segments'> | Models<'program_sessions'>)[]>((acc, item) => {
                acc.push(item)
                acc.push(...item.sessions)
                return acc
            }, []) || [],
        [data?.items]
    )

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if (!data?.items.length && isLoading)
        return (
            <Stack flex={1} alignItems="center" justifyContent="center">
                <ActivityIndicator />
            </Stack>
        )

    let idx = 0
    let currentSegment = ''
    const expirationDate = dayjs(params.program.user_programs[0].expires_at).format('DD/MM/YYYY')
    const expirationClose = dayjs(params.program.user_programs[0].expires_at).diff(dayjs(), 'day') <= EXPIRATION_WARNING

    return (
        <>
            <TransparentHeader />
            <FlashList
                data={listData}
                ListHeaderComponent={() => (
                    <Stack mb="$4">
                        <Image
                            source={{ uri: params.program.image }}
                            style={{ width: '100%', height: HEADER_MAX_HEIGHT }}
                            resizeMode="cover"
                        />
                        <Stack py="$2.5" bbw="$0.25" bbc="$gray5">
                            <Text ta="center" color={expirationClose ? '$yellow10' : '$gray3'} fontSize="$3">
                                Seu acesso expira dia {expirationDate}
                            </Text>
                        </Stack>
                    </Stack>
                )}
                renderItem={({ item }) => {
                    if (isProgramSession(item)) {
                        idx++
                        const segmntName = currentSegment
                        return (
                            <TouchableOpacity
                                onPress={() =>
                                    navigate(ERouteName.ProgramSession, {
                                        image: params.program.image,
                                        title: `${segmntName} - ${item.name}`,
                                        sessionId: item.id,
                                    })
                                }
                            >
                                <XStack my="$3" mx="$6" ai="center" gap="$2">
                                    <Stack br="$6" bg="$gray9" w={32} h={32} jc="center" ai="center">
                                        <Text color="white" fontSize="$6" fontWeight="bold">
                                            {idx}
                                        </Text>
                                    </Stack>
                                    <Text color="white" fontSize="$5">
                                        {item.name}
                                    </Text>
                                </XStack>
                            </TouchableOpacity>
                        )
                    }
                    idx = 0
                    currentSegment = item.name || ''
                    return (
                        <Text px="$6" mb="$3" mt="$4" color="$gray3" fontWeight="bold">
                            {item.name}
                        </Text>
                    )
                }}
                getItemType={(item) => (isProgramSession(item) ? 'row' : 'sectionHeader')}
                onEndReached={() => data?.nextPage && setCurrentPage(data?.nextPage)}
                keyExtractor={(item) => String(item.id)}
                estimatedItemSize={58}
                contentContainerStyle={{ paddingBottom: space['6'].val, backgroundColor: theme.gray7.val }}
                showsHorizontalScrollIndicator={false}
            />
        </>
    )
}

export default ProgramSegmentsScreen
