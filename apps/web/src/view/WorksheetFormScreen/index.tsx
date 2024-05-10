import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { IWorksheet, IWorksheetInput } from 'goal-models'
import { isWorksheetInputV2 } from 'goal-utils'
import { debounce } from 'radash'

import { Component, Match, Show, Switch, createEffect, createSignal } from 'solid-js'

import DashboardContainer from '@components/DashboardContainer'
import { useNavigate, useParams } from '@solidjs/router'
import { getDraftWeekByIdUseCase } from '@useCases/draft-week/getDraftWeekById'
import { removeDraftWeekUseCase } from '@useCases/draft-week/removeDraftWeek'
import { saveDraftWeekUseCase } from '@useCases/draft-week/saveDraftWeek'
import { getWorksheetWeekByIdUseCase } from '@useCases/worksheet/getWorksheetWeekById'
import { saveWorksheetWeekUseCase } from '@useCases/worksheet/saveWorksheet'
import { getErrorMessage } from '@utils/errors'

import WorksheetWeekV1 from './WorksheetWeekV1'
import WorksheetWeekV2 from './WorksheetWeekV2'

const WorksheetFormScreen: Component = () => {
    const [initialData, setInitialData] = createSignal<IWorksheetInput | IWorksheetInput<'v2'> | null>(null)
    const [loading, setLoading] = createSignal(true)
    const navigate = useNavigate()
    const params = useParams<{ worksheetId: string; weekId: string }>()

    const [drafWeek, setDraftWeek] = createSignal<IWorksheetInput | IWorksheetInput<'v2'> | null>(null)

    const deboucedSaveDraft = debounce(
        { delay: 5000 },
        (week: IWorksheetInput | IWorksheetInput<'v2'>, clear = false) => {
            try {
                if (clear) {
                    setDraftWeek(null)
                    if (week.id) removeDraftWeekUseCase(week.id)
                }

                if (deepEqual(week, drafWeek())) return

                // setDisplayTempSaved(false)
                // if (displayTempSavedTimeout) clearTimeout(displayTempSavedTimeout)

                saveDraftWeekUseCase(week)

                setDraftWeek(cloneDeep(week))

                // displayTempSavedTimeout = setTimeout(() => {
                //     setDisplayTempSaved(false)
                // }, 3000)
            } catch (err) {
                alert(getErrorMessage(err))
            } finally {
                // setLoadingTemp(false)
            }
        }
    )

    createEffect(() => {
        if (params.weekId && params.worksheetId) {
            if (!loadTempWorksheet(params.weekId)) loadWeek(params.weekId)
        } else setLoading(false)
    })

    async function loadWeek(weekId: string) {
        try {
            setLoading(true)

            const worksheet = await getWorksheetWeekByIdUseCase(weekId)

            setInitialData(worksheet)
        } catch (err) {
            const error = getErrorMessage(err)
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    function loadTempWorksheet(weekId: string) {
        try {
            const draftWeek = getDraftWeekByIdUseCase(weekId)
            if (!draftWeek) return null

            if (confirm('Existe um rascunho dessa semana, deseja carrega-la?')) {
                setInitialData(draftWeek)
                return draftWeek
            }
            return null
        } catch (err) {
            const error = getErrorMessage(err)
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    const saveWeek = async (week: IWorksheetInput | IWorksheetInput<'v2'>) => {
        if (week.published) {
            if (
                !confirm(
                    'Essa planilha está publicada, caso salvar todas as modificações serão visíveis imediatamente para os usuários. Deseja continuar?'
                )
            )
                return
        }

        const result = await saveWorksheetWeekUseCase(week)

        deboucedSaveDraft(result, true)

        navigate(`/dashboard/worksheet/${params.worksheetId}/${result.id}`)
    }

    return (
        <DashboardContainer>
            <Show when={!loading()}>
                <Switch>
                    <Match when={!initialData() || isWorksheetInputV2(initialData())}>
                        <WorksheetWeekV2
                            saveDraft={deboucedSaveDraft}
                            initialData={initialData() as IWorksheet<'v2'>}
                        />
                    </Match>
                    <Match when={initialData()?.version === null}>
                        <WorksheetWeekV1
                            saveDraft={deboucedSaveDraft}
                            initialData={initialData() as IWorksheet<'v1'>}
                        />
                    </Match>
                </Switch>
            </Show>
        </DashboardContainer>
    )
}

export default WorksheetFormScreen
