import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { IEventBlock, IUserWorkoutResultInput } from 'goal-models'
import { getWorkoutRestultType } from 'goal-utils'
import useSWR from 'swr'
import { Stack, Text, YStack } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import AddResultForm from '@components/AddResultFom'
import { IAddResultForm } from '@components/AddResultFom/config'
import Button from '@components/Button'
import Modal, { ModalProps } from '@components/Modal'
import Paper from '@components/Paper'
import UserListItem from '@components/UserListItem'
import { useLoggedUser } from '@contexts/user/userContext'
import { useBackHandler } from '@react-native-community/hooks'
import { Plus } from '@tamagui/lucide-icons'
import { getLastWorkoutResultsBySignatureUseCase } from '@useCases/result/getWorkoutResultsBySignature'
import { saveWorkoutResult } from '@useCases/result/saveWorkoutResult'
import { getErrorMessage } from '@utils/getErrorMessage'
import { getWorkoutSignature } from '@utils/getWorkoutSignature'

interface EventBlockDialogProps extends ModalProps {
    block: IEventBlock | null
}

const WorkoutResultDialog: React.FC<EventBlockDialogProps> = ({ block, open, onClose }) => {
    const [addResultFomOpen, setAddResultFomOpen] = useState(false)
    const user = useLoggedUser()
    const [workoutSignature, setWorkoutSignature] = useState('')

    const loadWorkoutSignature = async (workout: IEventBlock) => {
        const signature = await getWorkoutSignature(workout)
        setWorkoutSignature(signature)
    }

    useEffect(() => {
        if (!block) return
        loadWorkoutSignature(block)

        return () => {
            setWorkoutSignature('')
        }
    }, [block])

    const { data, isLoading, mutate } = useSWR(
        () => (!open || !workoutSignature || !user ? null : [user.uid, workoutSignature]),
        (obj) => getLastWorkoutResultsBySignatureUseCase(obj[0], obj[1]),
        {
            //revalidateIfStale: false,
            onError(err) {
                console.log(err)
            },
        }
    )

    const handleSave = async (result: IAddResultForm) => {
        try {
            if (!block) throw new Error('Workout não é válido')
            if (!user) throw new Error('Usuário não autenticado')

            const resultNormalized: Omit<IUserWorkoutResultInput, 'createdAt'> = {
                result: { type: result.type, value: result.value },
                isPrivate: result.isPrivate,
                date: result.date.toISOString(),
                workoutSignature,
                workout: block,
                uid: user.uid,
            }

            await saveWorkoutResult(resultNormalized)

            await mutate()

            setAddResultFomOpen(false)
        } catch (err) {
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        }
    }

    const handleBackPress = () => {
        if (addResultFomOpen) {
            setAddResultFomOpen(false)
            return true
        }

        return false
    }

    useBackHandler(handleBackPress)

    const displayResults = !!data?.length && !isLoading && !!workoutSignature
    const defaultWorkoutResultType = data?.length
        ? data[0].result.type || getWorkoutRestultType(block?.config.type)
        : null
    const disableResultTypeSwitch = !!data?.length

    return (
        <>
            <Modal open={open} onClose={onClose} id="result">
                <Paper>
                    <YStack br="$4" p="$3.5" bg="$gray8" gap="$3.5">
                        <Stack bg="$gray9" br="$4" px="$2.5" py="$3">
                            <Text fontWeight="700" fontSize={16}>
                                Últimos resultados
                            </Text>
                        </Stack>
                        {isLoading ? (
                            <ActivityIndicator />
                        ) : displayResults ? (
                            <YStack>
                                {data.map(({ id, user, result, isPrivate, createdAt }) => (
                                    <UserListItem
                                        key={id}
                                        user={user}
                                        result={result}
                                        isPrivate={isPrivate}
                                        createdAt={createdAt}
                                        my="$2"
                                    />
                                ))}
                            </YStack>
                        ) : (
                            <Text ta="center" fontSize={12}>
                                Nenhum resultado para esse workout
                            </Text>
                        )}
                    </YStack>
                    {!isLoading && (
                        <>
                            <Button
                                bg="white"
                                color="$gray9"
                                pressStyle={{
                                    bg: '$gray3',
                                }}
                                icon={<Plus />}
                                onPress={() => setAddResultFomOpen(true)}
                            >
                                Adicionar Resultado
                            </Button>
                        </>
                    )}

                    {!!onClose && <Button onPress={() => onClose()}>Fechar</Button>}
                </Paper>
            </Modal>

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
        </>
    )
}

export default WorkoutResultDialog
