import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { IUserWorkoutResult, IUserWorkoutResultInput, TResultType } from 'goal-models'
import { getWorkoutRestultType } from 'goal-utils'
import useSWRInfinite from 'swr/infinite'
import { Stack, Text, XStack, getTokens, useTheme } from 'tamagui'

import { useStorage } from '@common/hooks/useStorage'
import ActivityIndicator from '@components/ActivityIndicator'
import AddResultForm from '@components/AddResultFom'
import { IAddResultForm } from '@components/AddResultFom/config'
import AlertBox from '@components/AlertBox'
import Button from '@components/Button'
import EventBlock from '@components/EventBlock'
import Modal from '@components/Modal'
import Paper from '@components/Paper'
import UserResultItem from '@components/UserListItem'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'
import { FlashList } from '@shopify/flash-list'
import { Filter, Plus } from '@tamagui/lucide-icons'
import { getWorkoutResultsBySignatureUseCase } from '@useCases/result/getWorkoutResultsBySignatureUseCase'
import { saveWorkoutResult } from '@useCases/result/saveWorkoutResult'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

export interface UserWorkoutScreenProps {
    workoutSignature: string
    resultType: TResultType
}

const UserWorkoutScreen: React.FC = () => {
    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'UserWorkout'>>()
    const [addResultFomOpen, setAddResultFomOpen] = useState(false)

    const { currentValue: workoutResult, setItem: setWorkoutResult } = useStorage<'filtered' | 'all'>(
        '@workoutResultsFiltered',
        'all'
    )

    const { setOptions } = useNavigation()
    const theme = useTheme()
    const { space } = getTokens()
    const user = usePreventAccess()

    const getKey = (
        pageIndex: number,
        previousPageData: IUserWorkoutResult[]
    ): [string, string, TResultType, string | null | undefined, number, boolean] | null => {
        if (!user?.uid) return null

        if (previousPageData && !previousPageData.length) return null

        const previousLastItem = previousPageData?.[previousPageData.length - 1].id

        return [
            user.uid,
            params.workoutSignature,
            params.resultType,
            pageIndex === 0 ? null : previousLastItem,
            2,
            workoutResult === 'filtered',
        ]
    }

    const {
        data: workouts,
        isValidating,
        isLoading,
        setSize,
        size,
        mutate,
        error,
    } = useSWRInfinite(getKey, (res) => getWorkoutResultsBySignatureUseCase(...res))

    const mainResult = workouts?.[0][0]
    const workout = mainResult?.workout

    useEffect(() => {
        if (!mainResult) return
        setOptions({
            headerRight: () => (
                <Button variant="icon" icon={<Plus size={18} />} onPress={() => setAddResultFomOpen(true)} />
            ),
        })
    }, [mainResult])

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if (workouts && !workouts[0].length) return <AlertBox type="warning" text="Nenhum workout encontrado" />

    const handleSave = async (result: IAddResultForm) => {
        try {
            if (!mainResult || !workout) throw new Error('Workout não é válido')
            if (!user) throw new Error('Usuário não autenticado')

            const resultNormalized: Omit<IUserWorkoutResultInput, 'createdAt'> = {
                result: { type: result.type, value: result.value },
                isPrivate: result.isPrivate,
                date: result.date.toISOString(),
                workoutSignature: mainResult.workoutSignature,
                workout,
                uid: user.uid,
            }

            await saveWorkoutResult(resultNormalized)

            await mutate()

            setAddResultFomOpen(false)
        } catch (err) {
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        }
    }

    const defaultWorkoutResultType = mainResult
        ? mainResult.result.type || getWorkoutRestultType(mainResult.workout.config.type)
        : null
    const disableResultTypeSwitch = !!mainResult

    return (
        <Stack f={1}>
            <FlashList
                data={workouts?.flat() || []}
                horizontal={false}
                ListHeaderComponent={() => {
                    if (!workout) return null
                    return (
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
                renderItem={({ item: { user, result, isPrivate, date } }) => (
                    <UserResultItem user={user} result={result} isPrivate={isPrivate} date={date} my="$2" />
                )}
                contentContainerStyle={{
                    padding: space[6].val,
                    backgroundColor: theme.gray7.val,
                }}
                onEndReached={() => setSize(size + 1)}
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={56}
            />

            <Modal open={addResultFomOpen} onClose={() => setAddResultFomOpen(false)}>
                <Paper>
                    <AddResultForm
                        workoutResultType={defaultWorkoutResultType}
                        disableResultTypeSwitch={disableResultTypeSwitch}
                        onSubmit={handleSave}
                        onCancel={() => setAddResultFomOpen(false)}
                    />
                </Paper>
            </Modal>
        </Stack>
    )
}

export default UserWorkoutScreen
