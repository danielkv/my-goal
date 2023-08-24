import { Platform, TouchableOpacity } from 'react-native'

import dayjs from 'dayjs'
import { IUserWorkoutResult, TResultType } from 'goal-models'
import { group, unique } from 'radash'
import useSWRInfinite from 'swr/infinite'
import { Stack, Text, getTokens, useTheme } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import EventBlock from '@components/EventBlock'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { getUserWorkoutsByUserIdUseCase } from '@useCases/result/getUserWorkoutsByUserId'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

type TGrouptWorkoutResults = (IUserWorkoutResult | string)[]

function _convertToSections(results: IUserWorkoutResult[]): TGrouptWorkoutResults {
    if (!results.length) return []

    const groups = group(results, (item) => dayjs(item.createdAt).format('YYYY-MM-DD'))

    return Object.entries(groups).reduce<TGrouptWorkoutResults>((acc, [date, workouts]) => {
        if (!workouts) return acc

        acc.push(date)
        acc.push(...unique(workouts, (f) => f.workoutSignature))

        return acc
    }, [])
}

const UserWorkoutListScreen: React.FC = () => {
    const { navigate } = useNavigation()

    const theme = useTheme()
    const { space } = getTokens()

    const user = usePreventAccess()

    const getKey = (
        pageIndex: number,
        previousPageData: IUserWorkoutResult[]
    ): [string, string | null | undefined, number] | null => {
        if (!user?.uid) return null

        if (previousPageData && !previousPageData.length) return null

        const previousLastItem = previousPageData?.[previousPageData.length - 1].id

        return [user.uid, pageIndex === 0 ? null : previousLastItem, 2]
    }

    const { data, isLoading, size, setSize, error } = useSWRInfinite(getKey, (arg) =>
        getUserWorkoutsByUserIdUseCase(arg[0], arg[1], arg[2])
    )

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if (!data && isLoading)
        return (
            <Stack flex={1} ai="center" jc="center">
                <ActivityIndicator />
            </Stack>
        )

    const workouts = _convertToSections(data?.flat() || [])

    if (!workouts?.length)
        return (
            <Stack f={1} p="$4.5">
                <AlertBox
                    type="info"
                    title="Você não tem nenhum workout salvo"
                    text="Vá para tela de planilhas e adicione seus resultados"
                />
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

    const handleOnPressBlock = (workoutSignature: string, resultType: TResultType) => () =>
        navigate(ERouteName.UserWorkout, { workoutSignature, resultType })

    return (
        <Stack f={1}>
            <FlashList
                onEndReached={() => setSize(size + 1)}
                data={workouts}
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
                                <TouchableOpacity onPress={handleOnPressBlock(item.workoutSignature, item.result.type)}>
                                    <EventBlock disableButton block={item.workout} />
                                </TouchableOpacity>
                            </Stack>
                        )
                }}
                stickyHeaderIndices={Platform.OS === 'ios' ? stickyHeaderIndices : undefined}
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
