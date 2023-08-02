import { TouchableOpacity } from 'react-native'

import dayjs from 'dayjs'
import useSWR from 'swr'
import { Stack, Text, getTokens, useTheme } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import EventBlock from '@components/EventBlock'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { getUserWorkoutsByUserIdUseCase } from '@useCases/user/getUserWorkoutsByUserId'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const UserWorkoutListScreen: React.FC = () => {
    const { navigate } = useNavigation()

    const theme = useTheme()
    const { space } = getTokens()

    const user = usePreventAccess()

    const { data: workouts, isLoading, error } = useSWR(() => user?.uid, getUserWorkoutsByUserIdUseCase)

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if (!workouts && isLoading)
        return (
            <Stack flex={1} ai="center" jc="center">
                <ActivityIndicator />
            </Stack>
        )

    const stickyHeaderIndices = (workouts || [])
        .map((item, index) => {
            if (typeof item === 'string') {
                return index
            } else {
                return null
            }
        })
        .filter((item) => item !== null) as number[]

    return (
        <Stack f={1}>
            <FlashList
                data={workouts || []}
                horizontal={false}
                estimatedItemSize={105}
                renderItem={({ item }) => {
                    if (typeof item === 'string')
                        return (
                            <Stack bg="$gray7" pt="$2" px="$6">
                                <Stack bg="$gray9" br="$4" px="$2.5" py="$3">
                                    <Text fontWeight="700" fontSize={16}>
                                        Postado dia {dayjs(item).format('DD/MM/YY')}
                                    </Text>
                                </Stack>
                            </Stack>
                        )
                    else
                        return (
                            <Stack mb="$2" mx="$6" mt="$3">
                                <TouchableOpacity
                                    onPress={() => navigate(ERouteName.UserWorkout, { workoutId: item.id })}
                                >
                                    <EventBlock disableButton block={item.workout} />
                                </TouchableOpacity>
                            </Stack>
                        )
                }}
                stickyHeaderIndices={stickyHeaderIndices}
                getItemType={(item) => (typeof item === 'string' ? 'sectionHeader' : 'row')}
                contentContainerStyle={{
                    paddingVertical: space[6].val,
                    backgroundColor: theme.gray7.val,
                }}
                showsHorizontalScrollIndicator={false}
            />
        </Stack>
    )
}

export default UserWorkoutListScreen
