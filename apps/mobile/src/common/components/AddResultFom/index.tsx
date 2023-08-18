import { useState } from 'react'

import { FormikConfig, useFormik } from 'formik'
import { TResultType } from 'goal-models'
import { Switch, Text, ToggleGroup, XStack, YStack } from 'tamagui'

import Button from '@components/Button'
import DateField from '@components/DateField'
import TimeField from '@components/TimeField2'
import { Globe, Lock } from '@tamagui/lucide-icons'

import { IAddResultForm, addResultSchema, intialData } from './config'

export interface AddResultFormProps {
    onSubmit(result: IAddResultForm): Promise<void>
    onCancel?(): void
    workoutResultType?: TResultType | null
    disableResultTypeSwitch?: boolean
}

const AddResultForm: React.FC<AddResultFormProps> = ({
    onCancel,
    onSubmit,
    workoutResultType: workoutType,
    disableResultTypeSwitch,
}) => {
    const [time, setTime] = useState(0)

    const handleCancel = () => {
        onCancel?.()
    }

    const handleSave: FormikConfig<IAddResultForm>['onSubmit'] = async (result) => {
        return onSubmit(result)
    }

    const { handleSubmit, handleChange, values, isSubmitting, setFieldValue } = useFormik({
        onSubmit: handleSave,
        initialValues: intialData({ type: workoutType || undefined }),
        validationSchema: addResultSchema,
    })

    return (
        <YStack gap="$3.5">
            {!disableResultTypeSwitch && (
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
            )}
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
    )
}

export default AddResultForm
