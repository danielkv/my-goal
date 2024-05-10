import cloneDeep from 'clone-deep'
import { FiPlus } from 'solid-icons/fi'

import { Component, For, Show, createMemo, createResource, createSignal } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import DashboardContainer from '@components/DashboardContainer'
import Pagination from '@components/Pagination'
import WorksheetWeekItem from '@components/WorksheetWeekItem'
import { useNavigate, useParams } from '@solidjs/router'
import { Button, Container, Stack } from '@suid/material'
import { duplicateWeekUseCase } from '@useCases/worksheet/duplicateWorksheet'
import { GetWorksheetWeeksUseCaseArgs, getWorksheetWeeksUseCase } from '@useCases/worksheet/getWorksheetWeeks'
import { removeWorksheetUseCase } from '@useCases/worksheet/removeWorksheet'
import {
    ToggleWeekPublishedUseCaseAction,
    toggleWeekPublishedUseCase,
} from '@useCases/worksheet/toggleWorksheetPublished'
import { getErrorMessage } from '@utils/errors'
import { redirectToLogin } from '@utils/redirectToLogin'

const WorksheetWeeksScreen: Component = () => {
    redirectToLogin()
    const params = useParams<{ worksheetId: string }>()
    const [page, setPage] = createSignal(0)

    const args = createMemo<GetWorksheetWeeksUseCaseArgs>(() => ({
        worksheetId: params.worksheetId,
        page: page(),
        pageSize: 5,
    }))

    const [list, { refetch, mutate }] = createResource(args, getWorksheetWeeksUseCase)
    const [loading, setLoading] = createSignal(false)
    const [loadingWeek, setLoadingWeek] = createSignal<string | null>(null)

    const navigate = useNavigate()

    const handleClickWorksheetItem = (worksheetId: string, weekId: string) => () => {
        navigate(`/dashboard/worksheet/${worksheetId}/${weekId}`)
    }

    const handleClickWorksheetNew = () => {
        navigate(`/dashboard/worksheet/${params.worksheetId}/new`)
    }

    const handleDuplicateWeek = async (weekId: string) => {
        try {
            setLoading(true)

            await duplicateWeekUseCase(weekId)

            await refetch()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveWeek = async (weekId: string) => {
        const confirmation = confirm('Tem certeza que deseja excluir essa semana?')
        if (!confirmation) return

        try {
            setLoadingWeek(weekId)

            await removeWorksheetUseCase(weekId)

            await refetch()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoadingWeek(null)
        }
    }

    const handleToggleWeekPublished = async (action: ToggleWeekPublishedUseCaseAction, weekId: string) => {
        if (action === 'unpublish') {
            const confirmation = confirm(
                'Tem certeza que deseja despublicar essa semana? Os usuários não irão mais ve-la no aplicativo mobile.'
            )
            if (!confirmation) return
        } else {
            const confirmation = confirm(
                'Tem certeza que deseja publicar essa semana? Os usuários irão ve-la no aplicativo mobile.'
            )
            if (!confirmation) return
        }
        try {
            setLoadingWeek(weekId)

            await toggleWeekPublishedUseCase(weekId, action)

            mutate((data) => {
                if (!data) return list()

                const foundIndex = data?.items.findIndex((week) => week.id === weekId)
                const newData = cloneDeep(data)

                newData.items[foundIndex].published = action === 'publish'

                return newData
            })
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoadingWeek(null)
        }
    }

    return (
        <DashboardContainer>
            <Container maxWidth="sm">
                <Stack class="p-10" gap={4}>
                    <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={3}>
                        <Button
                            variant="contained"
                            disabled={list.loading || loading() || !!loadingWeek()}
                            startIcon={<FiPlus />}
                            onClick={handleClickWorksheetNew}
                        >
                            Adicionar semana
                        </Button>
                        <Show when={list.loading || loading()}>
                            <ActivityIndicator color="white" />
                        </Show>
                    </Stack>
                    <Show when={!!list()?.items.length}>
                        <Stack gap={3}>
                            <For each={list()?.items}>
                                {(worksheet) => (
                                    <WorksheetWeekItem
                                        week={worksheet}
                                        onClick={handleClickWorksheetItem(worksheet.worksheet_id!, worksheet.id)}
                                        onClickPublish={handleToggleWeekPublished}
                                        onClickDuplicate={handleDuplicateWeek}
                                        onClickDelete={handleRemoveWeek}
                                        disabled={loading() || !!loadingWeek() || list.loading}
                                    />
                                )}
                            </For>
                        </Stack>
                    </Show>
                </Stack>

                <Pagination
                    onClickNext={() => setPage((curr) => curr + 1)}
                    onClickPrev={() => setPage((curr) => curr - 1)}
                />
            </Container>
        </DashboardContainer>
    )
}

export default WorksheetWeeksScreen
