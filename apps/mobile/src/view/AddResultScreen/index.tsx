import { Alert } from 'react-native'

import { IEventBlock, IUserWorkoutResultInput } from 'goal-models'
import { mutate } from 'swr'
import { ScrollView, getTokens } from 'tamagui'

import AddResultForm from '@components/AddResultFom'
import { IAddResultForm } from '@components/AddResultFom/config'
import SafeAreaView from '@components/SafeAreaView'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'
import { saveWorkoutResult } from '@useCases/result/saveWorkoutResult'
import { getErrorMessage } from '@utils/getErrorMessage'
import { usePreventAccess } from '@utils/preventAccess'

export interface AddResultScreenProps {
    workoutSignature: string
    workout: IEventBlock
}

const AddResultScreen: React.FC = () => {
    const { space } = getTokens()
    const navigation = useNavigation()

    const {
        params: { workoutSignature, workout },
    } = useRoute<RouteProp<TReactNavigationStackParamList, 'AddResult'>>()

    const user = usePreventAccess()

    const handleCancel = () => {
        navigation.goBack()
    }

    const handleSave = async (result: IAddResultForm) => {
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

    return (
        <SafeAreaView>
            <ScrollView f={1} contentContainerStyle={{ padding: space[6].val }} keyboardShouldPersistTaps="always">
                <AddResultForm onSubmit={handleSave} onCancel={handleCancel} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default AddResultScreen
