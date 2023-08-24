import { useEffect, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { IUserMovementResultListResponse } from 'goal-models'
import useSWRInfinite from 'swr/infinite'
import { Stack, Text, YStack, debounce, getTokens, useTheme } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import TextField from '@components/TextField'
import { FlashList } from '@shopify/flash-list'
import { getMovementsUseCase } from '@useCases/movements/getMoments'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const LIST_ITEM_HEIGHT = 70

const MovementListScreen: React.FC = () => {
    const { space } = getTokens()
    const theme = useTheme()
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
    ): [string, string, string | null | undefined, number] | null => {
        if (!user?.uid) return null

        if (previousPageData && !previousPageData.length) return null

        const previousLastItem = previousPageData?.[previousPageData.length - 1].movement.id

        return [user.uid, searchInput.length >= 3 ? search : '', pageIndex === 0 ? null : previousLastItem, 30]
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
                ItemSeparatorComponent={() => <Stack bw={1} btc="$gray8" bbc="$gray6" my="0" />}
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
                            onPress={() => {}}
                            key={item.movement.movement}
                        >
                            <YStack>
                                <Text fontWeight="700" fontSize="$4">
                                    {item.movement.movement}
                                </Text>
                            </YStack>
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
