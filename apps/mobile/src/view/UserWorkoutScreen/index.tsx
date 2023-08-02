import { useEffect } from 'react'

import useSWR from 'swr'
import { Stack, Text, XStack, getTokens, useTheme } from 'tamagui'

import { useStorage } from '@common/hooks/useStorage'
import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import Button from '@components/Button'
import EventBlock from '@components/EventBlock'
import UserListItem from '@components/UserListItem'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { Filter, Plus } from '@tamagui/lucide-icons'
import { getUserWorkoutUseCase } from '@useCases/user/getUserWorkout'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const UserWorkoutScreen: React.FC = () => {
    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'UserWorkout'>>()
    const { currentValue: workoutResult, setItem: setWorkoutResult } = useStorage<'filtered' | 'all'>(
        '@workoutResultsFiltered',
        'all'
    )

    const { setOptions } = useNavigation()
    const theme = useTheme()
    const { space } = getTokens()
    const user = usePreventAccess()

    useEffect(() => {
        setOptions({ headerRight: () => <Button variant="icon" icon={<Plus size={18} />} /> })
    }, [])

    const {
        data: workouts,
        isLoading,
        error,
    } = useSWR(
        () => (user ? [user.uid, params.workoutId] : null),
        (res) => getUserWorkoutUseCase(res[0], res[1])
    )

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if (isLoading)
        return (
            <Stack flex={1} ai="center" jc="center">
                <ActivityIndicator />
            </Stack>
        )

    if (!workouts) return <AlertBox type="warning" text="Nenhum workout encontrado" />

    const workout = workouts[0].workout

    const filteredWorkouts = workoutResult === 'filtered' ? workouts.filter((w) => w.uid === user?.uid) : workouts

    return (
        <Stack f={1}>
            <FlashList
                data={filteredWorkouts}
                horizontal={false}
                ListHeaderComponent={() => (
                    <>
                        <EventBlock disableButton block={workout} />
                        <XStack jc="space-between" ai="center" my="$3.5" bg="$gray9" br="$4" px="$2.5" py="$3">
                            <Text fontWeight="700" fontSize={16}>
                                Resultados
                            </Text>

                            <Button
                                size="$3"
                                circular
                                icon={<Filter />}
                                onPress={() => setWorkoutResult(workoutResult === 'filtered' ? 'all' : 'filtered')}
                                bg={workoutResult === 'filtered' ? '$red5' : '$gray8'}
                            />
                        </XStack>
                    </>
                )}
                renderItem={({ item: { user, result, isPrivate, createdAt } }) => (
                    <UserListItem user={user} result={result} isPrivate={isPrivate} createdAt={createdAt} my="$2" />
                )}
                contentContainerStyle={{
                    padding: space[6].val,
                    backgroundColor: theme.gray7.val,
                }}
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={56}
            />
        </Stack>
    )
}

export default UserWorkoutScreen
