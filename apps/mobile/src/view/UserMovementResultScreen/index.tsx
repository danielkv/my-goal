import { useEffect, useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'

import { IUserMovementResultInput, IUserMovementResultResponse, IUserResult, TResultType } from 'goal-models'
import { displayResultValue } from 'goal-utils'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { Stack, Text, XStack, getTokens, useTheme } from 'tamagui'

import { useStorage } from '@common/hooks/useStorage'
import ActivityIndicator from '@components/ActivityIndicator'
import AddResultForm from '@components/AddResultFom'
import { IAddResultForm } from '@components/AddResultFom/config'
import AlertBox from '@components/AlertBox'
import Button from '@components/Button'
import Modal from '@components/Modal'
import Paper from '@components/Paper'
import UserResultItem from '@components/UserListItem'
import WeightPartials from '@components/WeightPartials'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { Dumbbell, Filter, Medal, Plus } from '@tamagui/lucide-icons'
import { getMovementByIdUseCase } from '@useCases/movements/getMovementById'
import { getMovementHighestScoreUseCase } from '@useCases/movements/getMovementHighestScore'
import { getMovementResultsByUserIdUseCase } from '@useCases/movements/getMovementResultsByUserId'
import { saveMovementResult } from '@useCases/movements/saveMovementResult'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const LIST_ITEM_HEIGHT = 70

const UserMovementResultScreen: React.FC = () => {
    const [addResultFomOpen, setAddResultFomOpen] = useState(false)
    const { setOptions } = useNavigation()
    const [selectedScore, setselectedScore] = useState<IUserResult | null>(null)
    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'UserMovementResult'>>()
    const { space } = getTokens()
    const theme = useTheme()

    const user = usePreventAccess()

    const { currentValue: workoutResult, setItem: setWorkoutResult } = useStorage<'filtered' | 'all'>(
        '@workoutResultsFiltered',
        'all'
    )

    const [endReached, setEndReached] = useState(false)

    const { data: movement } = useSWR(params.movementId, getMovementByIdUseCase, {
        revalidateIfStale: false,
    })

    const { data: highestScore, mutate: mutateHighScore } = useSWR(
        () => (movement?.resultType && user ? [params.movementId, user.uid, movement.resultType] : null),
        (args) => getMovementHighestScoreUseCase(...args),
        { revalidateIfStale: false }
    )

    const getKey = (
        pageIndex: number,
        previousPageData: IUserMovementResultResponse[]
    ): [string, string, TResultType, string | null | undefined, number, boolean] | null => {
        if (!user?.uid || !params.movementId || !movement) return null

        if (previousPageData && !previousPageData.length) return null

        const previousLastItem = previousPageData?.[previousPageData.length - 1].id

        return [
            user.uid,
            params.movementId,
            movement.resultType,
            pageIndex === 0 ? null : previousLastItem,
            30,
            workoutResult === 'filtered',
        ]
    }

    const {
        data,
        isLoading,
        isValidating,
        error,
        setSize,
        size,
        mutate: mutateScoreList,
    } = useSWRInfinite(getKey, (args) => getMovementResultsByUserIdUseCase(...args), {
        onSuccess(data) {
            if (data && !data.at(-1)?.length) setEndReached(true)
            else if (endReached) setEndReached(false)
        },
    })

    useEffect(() => {
        if (isLoading) return

        setOptions({
            headerRight: () => (
                <Button variant="icon" icon={<Plus size={18} />} onPress={() => setAddResultFomOpen(true)} />
            ),
        })
    }, [isLoading])

    const handleSave = async (result: IAddResultForm) => {
        try {
            if (!movement) throw new Error('Workout não é válido')
            if (!user) throw new Error('Usuário não autenticado')

            const resultNormalized: Omit<IUserMovementResultInput, 'createdAt'> = {
                result: { type: result.type, value: result.value },
                isPrivate: result.isPrivate,
                date: result.date.toISOString(),
                movementId: params.movementId,
                uid: user.uid,
            }

            await saveMovementResult(resultNormalized)

            await mutateScoreList()
            await mutateHighScore()

            setAddResultFomOpen(false)
        } catch (err) {
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        }
    }

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    const results = data?.flat()

    const defaultWorkoutResultType = movement ? movement.resultType : null

    const scoreCalculations = selectedScore || highestScore

    return (
        <Stack f={1}>
            <FlashList
                data={results}
                horizontal={false}
                ListHeaderComponent={() => {
                    return (
                        <Stack>
                            <XStack ai="center" gap="$2.5" mb="$2">
                                <Text fontSize="$7" fontWeight="700">
                                    {movement?.movement}
                                </Text>
                                {!!scoreCalculations && (
                                    <XStack
                                        br="$3"
                                        ai="center"
                                        bg={selectedScore ? '$green6' : undefined}
                                        px="$2"
                                        py="$1"
                                        gap="$1"
                                    >
                                        {!selectedScore && <Medal size={13} />}
                                        <Text fontSize="$5" color={selectedScore ? 'white' : '$gray4'}>
                                            {displayResultValue(
                                                scoreCalculations.result.type,
                                                scoreCalculations.result.value
                                            )}
                                        </Text>
                                    </XStack>
                                )}
                            </XStack>

                            {scoreCalculations?.result.type === 'weight' && (
                                <>
                                    <WeightPartials weight={scoreCalculations.result.value} count={5} />
                                    <WeightPartials weight={scoreCalculations.result.value} count={5} startPct={60} />
                                </>
                            )}

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
                        </Stack>
                    )
                }}
                onEndReached={() => !endReached && setSize(size + 1)}
                renderItem={({ item }) => {
                    const selected = selectedScore?.id === item.id
                    return (
                        <TouchableOpacity
                            onPress={() => (selected ? setselectedScore(null) : setselectedScore(item))}
                            style={{
                                padding: space['2'].val,
                                borderRadius: 9,
                                marginBottom: space['2'].val,
                                backgroundColor: selected ? theme.green6.val : 'transparent',
                            }}
                        >
                            <UserResultItem
                                date={item.date}
                                user={item.user}
                                isPrivate={item.isPrivate}
                                result={item.result}
                            />
                        </TouchableOpacity>
                    )
                }}
                ListFooterComponent={() => {
                    if (results && !results?.length)
                        return (
                            <Stack mt="$5" gap="$3">
                                <Text ta="center">Você não tem resultados adicionados a esse movimento</Text>
                                <Button onPress={() => setAddResultFomOpen(true)} icon={<Dumbbell />}>
                                    Adicionar PR
                                </Button>
                            </Stack>
                        )

                    if (!isValidating && !isLoading) return null

                    return (
                        <Stack flex={1} my="$3" ai="center" jc="center">
                            <ActivityIndicator />
                        </Stack>
                    )
                }}
                contentContainerStyle={{
                    backgroundColor: theme.gray7.val,
                    padding: space['5'].val,
                }}
                estimatedItemSize={LIST_ITEM_HEIGHT}
                showsHorizontalScrollIndicator={false}
            />
            <Modal open={addResultFomOpen} onClose={() => setAddResultFomOpen(false)}>
                <Paper>
                    <AddResultForm
                        workoutResultType={defaultWorkoutResultType}
                        disableResultTypeSwitch={true}
                        onSubmit={handleSave}
                        onCancel={() => setAddResultFomOpen(false)}
                    />
                </Paper>
            </Modal>
        </Stack>
    )
}

export default UserMovementResultScreen
