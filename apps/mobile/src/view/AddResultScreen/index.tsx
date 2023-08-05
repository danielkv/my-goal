import { useState } from 'react'
import { Alert } from 'react-native'

import { FormikConfig, useFormik } from 'formik'
import { IEventBlock, IUserWorkoutResultInput } from 'goal-models'
import { mutate } from 'swr'
import { ScrollView, Switch, Text, ToggleGroup, XStack, YStack, getTokens } from 'tamagui'

import Button from '@components/Button'
import DateField from '@components/DateField'
import SafeAreaView from '@components/SafeAreaView'
import TimeField from '@components/TimeField2'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'
import { Globe, Lock } from '@tamagui/lucide-icons'
import { saveWorkoutResult } from '@useCases/user/saveWorkoutResult'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

import { IAddResultForm, addResultSchema, intialData } from './config'

export interface AddResultScreenProps {
    workoutSignature: string
    workout: IEventBlock
}

const AddResultScreen: React.FC = () => {
    const [time, setTime] = useState(0)
    const { space } = getTokens()
    const navigation = useNavigation()

    const {
        params: { workoutSignature, workout },
    } = useRoute<RouteProp<TReactNavigationStackParamList, 'AddResult'>>()

    const user = usePreventAccess()

    const handleCancel = () => {
        navigation.goBack()
    }

    const handleSave: FormikConfig<IAddResultForm>['onSubmit'] = async (result) => {
        try {
            if (!user) throw new Error('Usuário não autenticado')

            const resultNormalized: Omit<IUserWorkoutResultInput, 'createdAt'> = {
                result: { type: result.type, value: result.value },
                isPrivate: result.isPrivate,
                date: result.date.toISOString(),
                workoutSignature,
                workout,
                uid: user.uid,
            }

            await saveWorkoutResult(resultNormalized)

            await mutate([user.uid, workoutSignature])

            navigation.goBack()
        } catch (err) {
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        }
    }

    const { handleSubmit, handleChange, values, isSubmitting, setFieldValue } = useFormik({
        onSubmit: handleSave,
        initialValues: intialData,
        validationSchema: addResultSchema,
    })

    return (
        <SafeAreaView>
            <ScrollView f={1} contentContainerStyle={{ padding: space[6].val }} keyboardShouldPersistTaps="always">
                <YStack gap="$3.5">
                    <ToggleGroup value={values.type} onValueChange={handleChange('type')} type="single" w="100%" h={40}>
                        <ToggleGroup.Item value="time" f={1}>
                            <Text>Tempo</Text>
                        </ToggleGroup.Item>
                        <ToggleGroup.Item value="reps" f={1}>
                            <Text>Repetições</Text>
                        </ToggleGroup.Item>
                        <ToggleGroup.Item value="weight" f={1}>
                            <Text>Carga (kg)</Text>
                        </ToggleGroup.Item>
                    </ToggleGroup>
                    <XStack jc="space-between" ai="flex-end">
                        <YStack gap="$2">
                            <Text fontSize="$3" color="$gray1">
                                Exibição
                            </Text>
                            <XStack ai="center" gap="$3">
                                <Switch
                                    checked={values.isPrivate}
                                    onCheckedChange={(checked) => setFieldValue('isPrivate', checked)}
                                    size="$3"
                                    bg={values.isPrivate ? '$red6' : '$green10'}
                                >
                                    <Switch.Thumb animation="quick" />
                                </Switch>
                                {values.isPrivate ? <Lock size={18} /> : <Globe size={18} />}
                            </XStack>
                        </YStack>
                        <DateField
                            value={values.date}
                            onChange={(_, newDate) => newDate && setFieldValue('date', newDate)}
                            mode="date"
                            maximumDate={new Date()}
                        />
                    </XStack>

                    <YStack gap="$2">
                        <Text fontSize="$3" color="$gray1">
                            Tempo
                        </Text>
                        <TimeField value={time} onChange={setTime} />
                    </YStack>

                    <Button loading={isSubmitting} onPress={() => handleSubmit()} variant="primary">
                        Salvar
                    </Button>

                    <Button disabled={isSubmitting} onPress={handleCancel}>
                        Cancelar
                    </Button>
                </YStack>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AddResultScreen
