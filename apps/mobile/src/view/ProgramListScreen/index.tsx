import { useState } from 'react'
import { RefreshControl } from 'react-native'

import useSWR from 'swr'
import { Stack, getTokens, useTheme } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { getProgramListUseCase } from '@useCases/programs/getProgramList'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

import ProgramListItem from './components/ProgramListItem'

const ProgramListScreen: React.FC = () => {
    const theme = useTheme()
    const { size: sizes } = getTokens()
    usePreventAccess()

    const [refreshing, setRefreshing] = useState(false)
    const { navigate } = useNavigation()

    const [currentPage, setCurrentPage] = useState(0)

    const { data, isLoading, error, mutate } = useSWR(['programList', currentPage, 10], (args) =>
        getProgramListUseCase({ page: args[1], pageSize: args[2] })
    )

    const handleRefresh = async () => {
        setRefreshing(true)
        await mutate()
        setRefreshing(false)
    }

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if (!data?.items.length && isLoading)
        return (
            <Stack flex={1} alignItems="center" justifyContent="center">
                <ActivityIndicator />
            </Stack>
        )

    return (
        <FlashList
            data={data?.items}
            renderItem={({ item }) => (
                <Stack mb="$3">
                    <ProgramListItem
                        onPress={(item) => navigate(ERouteName.ProgramSegments, { program: item })}
                        item={item}
                    />
                </Stack>
            )}
            onEndReached={() => data?.nextPage && setCurrentPage(data?.nextPage)}
            keyExtractor={(item) => String(item.id)}
            estimatedItemSize={93}
            contentContainerStyle={{ padding: sizes['2.5'].val, backgroundColor: theme.gray7.val }}
            showsHorizontalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    tintColor={theme.red5.val}
                    colors={[theme.red5.val]}
                    style={{ backgroundColor: theme.gray9.val }}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                />
            }
        />
    )
}

export default ProgramListScreen
