import cloneDeep from 'clone-deep'

import { Component, For, Show, createSignal } from 'solid-js'

import WorksheetItem from '@components/WorksheetItem'
import { useNavigate } from '@solidjs/router'
import { duplicateWorksheetUseCase } from '@useCases/worksheet/duplicateWorksheet'
import { getWorksheetsUseCase } from '@useCases/worksheet/getWorksheets'
import { removeWorksheetUseCase } from '@useCases/worksheet/removeWorksheet'
import { toggleWorksheetPublishedUseCase } from '@useCases/worksheet/toggleWorksheetPublished'
import { createStoreResource } from '@utils/createMutableResource'
import { redirectToLogin } from '@utils/redirectToLogin'

const WorksheetList: Component = () => {
    redirectToLogin()

    const [list, { refetch, mutate }] = createStoreResource(null, getWorksheetsUseCase)
    const [loading, setLoading] = createSignal(false)
    const [loadingWorksheet, setLoadingWorksheet] = createSignal<string | null>(null)

    const navigate = useNavigate()

    const handleClickWorksheetItem = (worksheetId: string) => () => {
        navigate(`/worksheet/${worksheetId}`)
    }

    const handleClickWorksheetNew = () => {
        navigate(`/worksheet/new`)
    }

    const handleDuplicateWorksheet = async (worksheetId: string) => {
        setLoading(true)

        await duplicateWorksheetUseCase(worksheetId)

        await refetch()

        setLoading(false)
    }

    const handleRemoveWorksheet = async (worksheetId: string) => {
        const confirmation = confirm('Tem certeza que deseja excluir essa planilha?')
        if (!confirmation) return

        setLoading(true)

        await removeWorksheetUseCase(worksheetId)

        await refetch()

        setLoading(false)
    }

    const handleToggleWorksheetPublished = (published: boolean) => async (worksheetId: string) => {
        if (published) {
            const confirmation = confirm(
                'Tem certeza que deseja despublicar essa planilha? Os usuários não irão mais ve-la no aplicativo mobile.'
            )
            if (!confirmation) return
        } else {
            const confirmation = confirm(
                'Tem certeza que deseja publicar essa planilha? Os usuários irão ve-la no aplicativo mobile.'
            )
            if (!confirmation) return
        }

        setLoadingWorksheet(worksheetId)

        await toggleWorksheetPublishedUseCase(worksheetId, published)

        mutate((data) => {
            if (!data) return list.resource

            const foundIndex = data?.findIndex((worksheet) => worksheet.id === worksheetId)
            const newData = cloneDeep(data)

            newData[foundIndex].published = !published

            return newData
        })

        setLoadingWorksheet(null)
    }

    return (
        <div class="p-10">
            <Show when={loading() || list.loading}>
                <div>Carregando...</div>
            </Show>
            <Show when={!list.loading && !!list.resource}>
                <div class="flex">
                    <For each={list.resource}>
                        {(worksheet) => (
                            <WorksheetItem
                                worksheet={worksheet}
                                onClick={handleClickWorksheetItem(worksheet.id)}
                                onClickDuplicate={handleDuplicateWorksheet}
                                onClickRemove={handleRemoveWorksheet}
                                onClickTooglePublish={handleToggleWorksheetPublished(!!worksheet.published)}
                                loading={loadingWorksheet() === worksheet.id}
                            />
                        )}
                    </For>
                    <WorksheetItem onClick={handleClickWorksheetNew} />
                </div>
            </Show>
        </div>
    )
}

export default WorksheetList
