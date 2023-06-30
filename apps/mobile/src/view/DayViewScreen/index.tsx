import { useEffect, useState } from 'react'

import dayjs from 'dayjs'
import { activateKeepAwakeAsync, deactivateKeepAwake, isAvailableAsync } from 'expo-keep-awake'
import { capitalize } from 'goal-utils'
import useSWR from 'swr'
import { Stack, XStack } from 'tamagui'

import { useStorage } from '@common/hooks/useStorage'
import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import Button from '@components/Button'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TReactNavigationStackParamList } from '@router/types'
import { AlignJustify, Lightbulb, LightbulbOff, PanelRightClose } from '@tamagui/lucide-icons'
import { getWorksheetDayByIdFnUseCase } from '@useCases/worksheet/getWorksheetDayById'
import { getErrorMessage } from '@utils/getErrorMessage'
import PeriodsListView from '@view/PeriodsListView'
import SectionCarouselView from '@view/SectionCarouselView'

import WorksheetOnboarding from './components/WorksheetOnboarding'

const DayViewScreen: React.FC = () => {
    const [keepAwakeAvailable, setKeepAwakeAvailable] = useState(false)

    const {
        currentValue: keepAwake,
        setItem: setKeepAwake,
        loading: loadingKeepAwake,
    } = useStorage<'enabled' | 'disabled'>('@worksheetKeepAwake', 'disabled')

    const {
        currentValue: viewType,
        setItem: setViewType,
        loading,
    } = useStorage<'list' | 'carousel'>('@worksheetViewType', 'carousel')

    const {
        params: { worksheetId, dayId },
    } = useRoute<RouteProp<TReactNavigationStackParamList, 'DayView'>>()
    const navigation = useNavigation()

    const { data, isLoading, error } = useSWR(
        [worksheetId, dayId, 'worksheetDay'],
        (args: string[]) => getWorksheetDayByIdFnUseCase(args[0], args[1]),
        {
            onSuccess(result) {
                if (!result?.date) return
                const date = capitalize(dayjs(result.date).format('ddd[.] DD/MM/YYYY'))

                navigation.setOptions({
                    title: date,
                })
            },
        }
    )

    useEffect(() => {
        isAvailableAsync().then(setKeepAwakeAvailable)
    }, [])

    useEffect(() => {
        if (keepAwake === 'disabled') {
            deactivateKeepAwake()
        } else {
            activateKeepAwakeAsync()
        }

        return () => {
            deactivateKeepAwake()
        }
    }, [keepAwake])

    useEffect(() => {
        if (loadingKeepAwake) return

        navigation.setOptions({
            headerRight: () => {
                if (!keepAwakeAvailable) return null
                return (
                    <XStack>
                        <Button
                            variant="icon"
                            bg="transparent"
                            onPress={() => setKeepAwake(keepAwake === 'enabled' ? 'disabled' : 'enabled')}
                            icon={keepAwake === 'disabled' ? <Lightbulb size="$1" /> : <LightbulbOff size="$1" />}
                        />
                    </XStack>
                )
            },
        })
    }, [viewType, keepAwake, loadingKeepAwake, keepAwakeAvailable])

    if (error) return <AlertBox type="error" title="Ocorreu um erro" text={getErrorMessage(error)} />

    if ((!data && isLoading) || loading)
        return (
            <Stack flex={1} ai="center" jc="center">
                <ActivityIndicator />
            </Stack>
        )

    if (!data) return <AlertBox type="info" text="Nenhum resultado encontrato" />

    return (
        <Stack flex={1}>
            {viewType === 'carousel' ? <SectionCarouselView day={data} /> : <PeriodsListView day={data} />}

            <Button
                size="$5"
                variant="icon"
                bg="$gray6"
                elevate
                elevation="$4"
                onPress={() => setViewType(viewType === 'list' ? 'carousel' : 'list')}
                icon={viewType === 'carousel' ? <AlignJustify size="$1.5" /> : <PanelRightClose size="$1.5" />}
                position="absolute"
                bottom="$4"
                right="$3"
            />

            <WorksheetOnboarding />
        </Stack>
    )
}

export default DayViewScreen
