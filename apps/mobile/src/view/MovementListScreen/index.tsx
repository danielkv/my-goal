import { useEffect, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import dayjs from 'dayjs'
import { IUserMovementResultListResponse } from 'goal-models'
import { displayResultValue } from 'goal-utils'
import useSWRInfinite from 'swr/infinite'
import { Stack, Text, XStack, YStack, debounce, getTokens, useTheme } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import TextField from '@components/TextField'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { getMovementsUseCase } from '@useCases/movements/getMoments'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const LIST_ITEM_HEIGHT = 70

const MovementListScreen: React.FC = () => {
    const { space } = getTokens()
    const theme = useTheme()
    const { navigate } = useNavigation()
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [endReached, setEndReached] = useState(false)

    const debouncedSearch = useRef(debounce(setSearch, 300))

    useEffect(() => {
        debouncedSearch.current(searchInput)
    }, [searchInput])

    const user = usePreventAccess()

    const getKey = (
        pageIndex: number,
        previousPageData: IUserMovementResultListResponse[]
    ): [string, string, number, number] | null => {
        if (!user?.id) return null

        if (previousPageData && !previousPageData.length) return null

        return [user.id, searchInput.length >= 3 ? search : '', pageIndex, 30]
    }

    const { data, isLoading, isValidating, error, setSize, size } = useSWRInfinite(
        getKey,
        (args) => getMovementsUseCase(...args),
        {
            onSuccess(data) {
                if (data && !data.at(-1)?.length) setEndReached(true)
                else if (endReached) setEndReached(false)
            },
        }
    )

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    return (
        <Stack f={1}>
            <Stack m="$3.5">
                <TextField label="Buscar" value={searchInput} onChangeText={(value) => setSearchInput(value)} />
            </Stack>
            <FlashList
                data={data?.flat()}
                horizontal={false}
                ItemSeparatorComponent={() => <Stack bw={1} btc="$gray8" bbc="$gray6" my={0} />}
                onEndReached={() => !endReached && setSize(size + 1)}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            style={{
                                height: LIST_ITEM_HEIGHT,
                                paddingHorizontal: space['5'].val,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}
                            onPress={() => navigate(ERouteName.UserMovementResult, { movementId: item.movement.id })}
                            key={item.movement.movement}
                        >
                            <XStack jc="space-between" ai="center" f={1}>
                                <YStack>
                                    <Text fontWeight="700" fontSize="$5">
                                        {item.movement.movement}
                                    </Text>
                                    {!!item.result && (
                                        <Text color="$gray3" fontSize="$3">
                                            {dayjs(item.result.date).format('DD/MM/YY')}
                                        </Text>
                                    )}
                                </YStack>
                                {!!item.result && (
                                    <Text color="$gray3" fontWeight="700" fontSize="$5">
                                        {displayResultValue(item.result.resultType, item.result.resultValue)}
                                    </Text>
                                )}
                            </XStack>
                        </TouchableOpacity>
                    )
                }}
                ListFooterComponent={() => {
                    if (!isValidating && !isLoading) return null

                    return (
                        <Stack flex={1} my="$3" ai="center" jc="center">
                            <ActivityIndicator />
                        </Stack>
                    )
                }}
                contentContainerStyle={{
                    backgroundColor: theme.gray7.val,
                }}
                estimatedItemSize={LIST_ITEM_HEIGHT}
                showsHorizontalScrollIndicator={false}
            />
        </Stack>
    )
}

export default MovementListScreen
