import { useCallback } from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'

import { pluralize } from 'goal-utils'
import useSWR from 'swr'
import { Stack, Text, XStack, getTokens, useTheme } from 'tamagui'
import { Image } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import TransparentHeader from '@components/TransparentHeader'
import { RouteProp, StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName, TReactNavigationStackParamList } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { ArrowRightCircle, Check } from '@tamagui/lucide-icons'
import { getGroupsBySessionIdUseCase } from '@useCases/programs/getGroupsBySessionId'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const HEADER_MAX_HEIGHT = Dimensions.get('screen').height / 3

const ProgramSessioncreen: React.FC = () => {
    const { navigate, dispatch } = useNavigation()

    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'ProgramSession'>>()

    useFocusEffect(
        useCallback(() => {
            if (!params.image || !params.title || !params.sessionId)
                return dispatch(StackActions.replace(ERouteName.ProgramList))
        }, [params])
    )

    const theme = useTheme()
    const { space } = getTokens()
    usePreventAccess()

    const { data, isLoading, error } = useSWR(
        () => (params.image && params.title && params.sessionId ? ['classList', params.sessionId] : null),
        (args) => getGroupsBySessionIdUseCase(args[1])
    )

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if (!data?.length && isLoading)
        return (
            <Stack flex={1} alignItems="center" justifyContent="center">
                <ActivityIndicator />
            </Stack>
        )

    return (
        <>
            <TransparentHeader title={params.title} />
            <FlashList
                data={data}
                ListHeaderComponent={() => (
                    <Stack mb="$4">
                        <Image
                            source={{ uri: params.image }}
                            style={{ width: '100%', height: HEADER_MAX_HEIGHT }}
                            resizeMode="cover"
                        />
                    </Stack>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            item.id &&
                            item.name &&
                            navigate(ERouteName.ProgramGroupScreen, {
                                groupId: item.id,
                                title: item.name,
                            })
                        }
                    >
                        <XStack my="$3" mx="$6" ai="center" gap="$2">
                            <Stack br="$6">
                                {item.watched_at ? (
                                    <Check size={18} color="$green10" />
                                ) : (
                                    <ArrowRightCircle size={18} color="$gray4" />
                                )}
                            </Stack>
                            <Text color="white" fontSize="$5">
                                {item.name}
                            </Text>
                            {!!item.movements.length && (
                                <Text color="$gray4" fontSize="$3">
                                    {item.movements.length} {pluralize(item.movements.length, 'movimento')}
                                </Text>
                            )}
                        </XStack>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => String(item.id)}
                estimatedItemSize={58}
                contentContainerStyle={{ paddingBottom: space['6'].val, backgroundColor: theme.gray7.val }}
                showsHorizontalScrollIndicator={false}
            />
        </>
    )
}

export default ProgramSessioncreen
