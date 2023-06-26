import { useCallback, useState } from 'react'
import { RefreshControl } from 'react-native'

import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import { useLoggedUser } from '@contexts/user/userContext'
import { RouteProp, StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName, TReactNavigationStackParamList } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { getWorksheetByIdUseCase } from '@useCases/worksheet/getWorksheetById'
import { getErrorMessage } from '@utils/getErrorMessage'

import useSWR from 'swr'
import { Stack, getTokens, useTheme } from 'tamagui'

import WorksheetDayItem from './components/WorksheetDayItem'

const WorksheetDays: React.FC = () => {
    const theme = useTheme()
    const { size: sizes } = getTokens()

    const [refreshing, setRefreshing] = useState(false)
    const {
        params: { id: worksheetId },
    } = useRoute<RouteProp<TReactNavigationStackParamList, 'WorksheetDays'>>()
    const { navigate, dispatch } = useNavigation()
    const user = useLoggedUser()

    const { data, isLoading, error, mutate } = useSWR(
        () => (user ? [worksheetId, 'worksheetDay'] : null),
        (args: string[]) => getWorksheetByIdUseCase(args[0])
    )

    useFocusEffect(
        useCallback(() => {
            if (!user) dispatch(StackActions.replace(ERouteName.LoginScreen))
        }, [user])
    )

    const handleRefresh = async () => {
        setRefreshing(true)
        await mutate()
        setRefreshing(false)
    }

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if (!data && isLoading)
        return (
            <Stack flex={1} alignItems="center" justifyContent="center">
                <ActivityIndicator />
            </Stack>
        )

    return (
        <FlashList
            data={data?.days}
            numColumns={2}
            horizontal={false}
            renderItem={({ item }) => (
                <Stack m="$2" f={1}>
                    <WorksheetDayItem
                        item={item}
                        onPress={(item) =>
                            navigate(ERouteName.DayView, {
                                dayId: item.id,
                                worksheetId: data?.id || '',
                            })
                        }
                    />
                </Stack>
            )}
            contentContainerStyle={{ padding: sizes['2.5'].val, backgroundColor: theme.gray7.val }}
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={128}
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

export default WorksheetDays
