import { useEffect, useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'

import { IUserHighestResult, IUserMovementResultInput, IUserMovementResultResponse, IUserResult } from 'goal-models'
import { displayResultValue } from 'goal-utils'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { Slider, Stack, Text, XStack, getTokens, useTheme } from 'tamagui'

import { useStorage } from '@common/hooks/useStorage'
import ActivityIndicator from '@components/ActivityIndicator'
import AddResultForm from '@components/AddResultFom'
import { IAddResultForm } from '@components/AddResultFom/config'
import AlertBox from '@components/AlertBox'
import { alert } from '@components/AppAlert/utils'
import Button from '@components/Button'
import Modal from '@components/Modal'
import Paper from '@components/Paper'
import UserResultItem from '@components/UserListItem'
import WeightPartials from '@components/WeightPartials'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { Calculator, Dumbbell, Filter, Medal, Plus } from '@tamagui/lucide-icons'
import { getMovementByIdUseCase } from '@useCases/movements/getMovementById'
import { getMovementHighestScoreUseCase } from '@useCases/movements/getMovementHighestScore'
import { getMovementResultsByUserIdUseCase } from '@useCases/movements/getMovementResultsByUserId'
import { removeMovementResultUseCase } from '@useCases/movements/removeMovementResult'
import { saveMovementResultUseCase } from '@useCases/movements/saveMovementResult'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

const LIST_ITEM_HEIGHT = 70

const UserMovementResultScreen: React.FC = () => {
    const [addResultFomOpen, setAddResultFomOpen] = useState(false)
    const { setOptions } = useNavigation()
    const [selectedScore, setSelectedScore] = useState<IUserResult | null>(null)
    const [sliderValue, setSliderValue] = useState([50])
    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'UserMovementResult'>>()
    const { space } = getTokens()
    const theme = useTheme()

    const user = usePreventAccess()

    const { currentValue: workoutResult, setItem: setWorkoutResult } = useStorage<'filtered' | 'all'>(
        '@workoutResultsFiltered',
        'all'
    )

    const [endReached, setEndReached] = useState(false)

    const { data: movement } = useSWR(String(params.movementId), getMovementByIdUseCase, {
        revalidateIfStale: false,
    })

    const { data: highestScore, mutate: mutateHighScore } = useSWR(
        () => (movement?.resultType && user ? [params.movementId, user.id] : null),
        (args) => getMovementHighestScoreUseCase(...args),
        { revalidateIfStale: false }
    )

    const getKey = (
        pageIndex: number,
        previousPageData: IUserMovementResultResponse[]
    ): [string, string, number, number, boolean] | null => {
        if (!user?.id || !params.movementId || !movement) return null

        if (previousPageData && !previousPageData.length) return null

        return [user.id, params.movementId, pageIndex, 30, workoutResult === 'filtered']
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

            const resultNormalized: IUserMovementResultInput = {
                resultValue: result.value,
                resultType: result.type,
                isPrivate: result.isPrivate,
                date: result.date.toISOString(),
                movementId: params.movementId,
                userId: user.id,
            }

            await saveMovementResultUseCase(resultNormalized)

            await mutateScoreList()
            await mutateHighScore()

            setAddResultFomOpen(false)
        } catch (err) {
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        }
    }

    const handleConfirmRemoveMovementResult = async (movementResultId: string) => {
        try {
            await removeMovementResultUseCase(movementResultId)

            await mutateScoreList()
            await mutateHighScore()
        } catch (err) {
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        }
    }

    const handleRemoveMovementResult = (movementResponse: IUserMovementResultResponse) => () => {
        if (user?.id !== movementResponse.user.id) return

        alert(
            'Remover PR',
            'Tem certeza que deseja excluir esse PR?',
            [{ text: 'Sim', onPress: () => handleConfirmRemoveMovementResult(movementResponse.id) }],
            true
        )
    }

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    const results = data?.flat()

    const defaultWorkoutResultType = movement ? movement.resultType : null

    const scoreCalculations: IUserHighestResult | null = selectedScore || highestScore || null
    const calculatorWeight = Math.round((sliderValue[0] / 100) * (scoreCalculations?.resultValue || 0) * 100) / 100

    return (
        <Stack f={1} px="$5" pt="$5">
            <Stack>
                <XStack ai="center" gap="$2.5" mb="$2">
                    <Text fontSize="$7" fontWeight="700">
                        {movement?.movement}
                    </Text>
                    {!!scoreCalculations && (
                        <XStack br="$3" ai="center" bg={selectedScore ? '$green6' : undefined} px="$2" py="$1" gap="$1">
                            {!selectedScore && <Medal size={13} />}
                            <Text fontSize="$5" color={selectedScore ? 'white' : '$gray4'}>
                                {displayResultValue(scoreCalculations.resultType, scoreCalculations.resultValue)}
                            </Text>
                        </XStack>
                    )}
                </XStack>

                {scoreCalculations?.resultType === 'weight' && (
                    <>
                        <Stack>
                            <WeightPartials weight={scoreCalculations.resultValue || 0} count={5} />
                            <WeightPartials weight={scoreCalculations.resultValue || 0} count={5} startPct={60} />
                        </Stack>

                        <XStack mt="$2" ai="center" gap="$3">
                            <Calculator />
                            <Text color="$gray2">{sliderValue}%</Text>
                            <Slider
                                size="$2"
                                f={1}
                                value={sliderValue}
                                onValueChange={(newValue) => {
                                    setSliderValue(newValue)
                                }}
                                max={120}
                                min={5}
                                step={5}
                            >
                                <Slider.Track>
                                    <Slider.TrackActive bg="$red8" />
                                </Slider.Track>
                                <Slider.Thumb circular index={0} />
                            </Slider>
                            <Text fontSize="$6" fontWeight="bold">
                                {displayResultValue(scoreCalculations.resultType, calculatorWeight)}
                            </Text>
                        </XStack>
                    </>
                )}

                <XStack jc="space-between" ai="center" mt="$5" mb={0} bg="$gray9" br="$4" px="$2.5" py="$3">
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
            <FlashList
                data={results}
                horizontal={false}
                onEndReached={() => !endReached && setSize(size + 1)}
                renderItem={({ item }) => {
                    const selected = selectedScore?.id === item.id
                    return (
                        <TouchableOpacity
                            onPress={() => (selected ? setSelectedScore(null) : setSelectedScore(item))}
                            onLongPress={handleRemoveMovementResult(item)}
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
                                result={{ type: item.resultType, value: item.resultValue }}
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
                    paddingVertical: space['2'].val,
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
