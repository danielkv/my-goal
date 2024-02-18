import { useState } from 'react'
import { RefreshControl } from 'react-native'

import useSWR from 'swr'
import { Stack, getTokens, useTheme } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import { useLoggedUser } from '@contexts/user/userContext'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { getWorksheetListUseCase } from '@useCases/worksheet/getWorksheetList'
import { getErrorMessage } from '@utils/getErrorMessage'

import WorksheetListItem from './components/WorksheetListItem'

const WorksheetListScreen: React.FC = () => {
    const theme = useTheme()
    const { size: sizes } = getTokens()

    const [refreshing, setRefreshing] = useState(false)
    const { navigate } = useNavigation()
    const user = useLoggedUser()

    const { data, isLoading, error, mutate } = useSWR('worksheetList', getWorksheetListUseCase)

    const handleRefresh = async () => {
        setRefreshing(true)
        await mutate()
        setRefreshing(false)
    }

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if (!data?.length && isLoading)
        return (
            <Stack flex={1} alignItems="center" justifyContent="center">
                <ActivityIndicator />
            </Stack>
        )

    return (
        <FlashList
            data={data}
            renderItem={({ item }) => (
                <Stack mb="$3">
                    <WorksheetListItem
                        onPress={(item) => navigate(ERouteName.WorksheetDays, { id: item.id })}
                        item={item}
                    />
                </Stack>
            )}
            keyExtractor={(item) => String(item.id)}
            ListHeaderComponent={() => {
                if (user) return null
                return <AlertBox mb="$4" type="info" text="Para ver qualquer planilha você precisa estar logado" />
            }}
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

export default WorksheetListScreen
