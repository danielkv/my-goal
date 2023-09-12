import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { IWorksheet, IWorksheetModel } from 'goal-models'
import { isWorksheetModel } from 'goal-utils'
import { debounce } from 'radash'
import { FiArrowLeft, FiArrowRight, FiEye } from 'solid-icons/fi'
import { VsHistory } from 'solid-icons/vs'

import { Component, Show, createEffect, createSignal } from 'solid-js'
import { SetStoreFunction, StoreSetter, createStore, produce } from 'solid-js/store'

import WorksheetPreview from '@components/WorksheetPreview'
import { Path } from '@interfaces/app'
import { useParams } from '@solidjs/router'
import { Box, Chip, Drawer, IconButton, Stack, Toolbar } from '@suid/material'
import { getTempWorksheetByIdUseCase } from '@useCases/temp-worksheet/getTempWorksheetById'
import { saveTempWorksheetUseCase } from '@useCases/temp-worksheet/saveTempWorksheet'
import { getWorksheetByIdUseCase } from '@useCases/worksheet/getWorksheetById'
import { getErrorMessage } from '@utils/errors'
import {
    findNextIndexPath,
    findPreviousIndexPath,
    getLastIndex,
    getPeaceFromPath,
    pathToParent,
    setPeaceFromPath,
} from '@utils/paths'
import { redirectToLogin } from '@utils/redirectToLogin'
import { createWorksheetValues } from '@utils/worksheetInitials'

import Form from './components/Form'
import SaveContainer from './components/SaveContainer'

const CreateNewDay: Component = () => {
    redirectToLogin()

    let displayTempSavedTimeout: number
    const [hasHistorySaved, setHasHistorySaved] = createSignal<IWorksheetModel | null>(null)
    const [lastTempSaved, setLastTempSaved] = createSignal<IWorksheetModel>()
    const [displayTempSaved, setDisplayTempSaved] = createSignal(false)
    const [loadingTemp, setLoadingTemp] = createSignal(false)
    const [loading, setLoading] = createSignal(false)
    const [error, setError] = createSignal<string | null>(null)
    const [drawerOpen, setDrawerOpen] = createSignal(false)

    const [currentPath, setCurrentPath] = createSignal<Path>('' as Path)

    const [worksheetStore, doSetWorksheetStore] = createStore<IWorksheet>(createWorksheetValues())

    const debouncedSaveTempWorksheet = debounce({ delay: 5000 }, async (worksheet: IWorksheetModel) => {
        try {
            if (deepEqual(worksheet, lastTempSaved())) return

            setDisplayTempSaved(false)
            if (displayTempSavedTimeout) clearTimeout(displayTempSavedTimeout)

            setLoadingTemp(true)
            await saveTempWorksheetUseCase(worksheet)

            setLastTempSaved(cloneDeep(worksheet))

            setDisplayTempSaved(true)

            setHasHistorySaved(null)

            displayTempSavedTimeout = setTimeout(() => {
                setDisplayTempSaved(false)
            }, 3000)
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoadingTemp(false)
        }
    })

    //@ts-expect-error
    const setWorksheetStore: SetStoreFunction<IWorksheet> = (storeFn: StoreSetter<IWorksheet, []>) => {
        doSetWorksheetStore(storeFn)

        if (isWorksheetModel(worksheetStore)) debouncedSaveTempWorksheet(worksheetStore)
    }

    createEffect(() => {
        const params = useParams()

        if (params.id) loadWorksheet(params.id)
        else {
            setWorksheetStore(createWorksheetValues())
            setCurrentPath('worksheet')
        }
    })

    const handleViewWorksheet = () => {
        if (!worksheetStore.id) return

        window.open(`/worksheet/view/${worksheetStore.id}`)
    }

    const handleRemovePeace = <Values,>(path: Path) => {
        const listPath = pathToParent(path)
        const lastIndex = getLastIndex(path)
        const returnPath = pathToParent(path, 2)

        setWorksheetStore(
            produce((current) => {
                const list = getPeaceFromPath<Values[]>(current, listPath)

                list.splice(lastIndex, 1)
            })
        )

        setTimeout(() => {
            setCurrentPath(returnPath)
        }, 1)
    }

    const handleUpdatePeace = <Value,>(path: Path, newValue: Value) => {
        setWorksheetStore(
            produce((current) => {
                const result = setPeaceFromPath(current, path, newValue)

                return result
            })
        )
    }

    const handleAddPeace = <Values,>(path: Path, initialValues: Values, override?: Partial<Values>) => {
        const listPath = pathToParent(path)
        const lastIndex = getLastIndex(path)
        const newValue = { ...initialValues, ...override }

        setWorksheetStore(
            produce((current) => {
                const list = getPeaceFromPath<Values[]>(current, listPath)

                list.splice(lastIndex, 0, newValue)
            })
        )
        setTimeout(() => {
            setCurrentPath(path)
        }, 1)
    }

    const handleMovePeace = (path: Path, to: 'up' | 'down') => {
        const currentListPath = pathToParent(path)
        const currentIndex = getLastIndex(path)

        const newPath =
            to === 'up' ? findPreviousIndexPath(worksheetStore, path) : findNextIndexPath(worksheetStore, path)

        if (!newPath) return

        const newListPath = pathToParent(newPath)
        const newIndex = getLastIndex(newPath)

        setWorksheetStore(
            produce((current) => {
                const currentObject = getPeaceFromPath<Record<string, any>>(current, path)

                const currentList = getPeaceFromPath<Record<string, any>[]>(current, currentListPath)
                const newList = getPeaceFromPath<Record<string, any>[]>(current, newListPath)

                currentList.splice(currentIndex, 1)
                newList.splice(newIndex, 0, currentObject)
            })
        )
        setTimeout(() => {
            setCurrentPath(newPath)
        }, 1)
    }

    async function loadTempWorksheet(worksheetId: string) {
        try {
            const tempWorksheet = await getTempWorksheetByIdUseCase(worksheetId)
            if (!tempWorksheet) return

            setHasHistorySaved(tempWorksheet)
        } catch (err) {
            const error = getErrorMessage(err)
            alert(error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    async function loadWorksheet(worksheetId: string) {
        try {
            setError(null)
            setLoading(true)

            const worksheet = await getWorksheetByIdUseCase(worksheetId)

            setLastTempSaved(cloneDeep(worksheet))
            doSetWorksheetStore(worksheet)

            loadTempWorksheet(worksheetId)
        } catch (err) {
            const error = getErrorMessage(err)
            alert(error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    function handleRecoverWorksheet() {
        const worksheet = hasHistorySaved()
        if (!worksheet) return
        setLastTempSaved(cloneDeep(worksheet))
        doSetWorksheetStore(cloneDeep(worksheet))
        setHasHistorySaved(null)
    }

    return (
        <div
            style={{
                height: 'calc(100% - 80px)',
            }}
        >
            <div class="flex flex-1 flex-col basis-auto overflow-auto relative">
                <Box class="fixed bottom-3 left-3">
                    <Show when={loadingTemp()}>
                        <Chip class="animate-pulse" color="info" label="Salvando rascunho..." />
                    </Show>
                    <Show when={displayTempSaved()}>
                        <Chip color="success" label="Rascunho salvo!" />
                    </Show>
                </Box>
                <Box class=" bg-gray-700">
                    <Toolbar>
                        <Stack flex={1} direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                            <button
                                class="bg-gray-900 p-3 rounded-full hover:bg-gray-700"
                                onClick={() => setDrawerOpen(true)}
                                title="Abrir menu"
                            >
                                <FiArrowRight size={22} />
                            </button>
                            <Stack direction="row" alignItems="center" gap={2}>
                                {hasHistorySaved() && (
                                    <Box>
                                        <button
                                            disabled={!worksheetStore.id}
                                            class="bg-gray-900 p-3 rounded-full hover:bg-gray-700"
                                            onClick={handleRecoverWorksheet}
                                            title="Abrir visualização"
                                        >
                                            <VsHistory size={22} />
                                        </button>
                                    </Box>
                                )}
                                <Box>
                                    <button
                                        disabled={!worksheetStore.id}
                                        class="bg-gray-900 p-3 rounded-full hover:bg-gray-700"
                                        onClick={handleViewWorksheet}
                                        title="Abrir visualização"
                                    >
                                        <FiEye size={22} />
                                    </button>
                                </Box>
                            </Stack>
                        </Stack>
                    </Toolbar>
                </Box>

                {error() ? (
                    <div class="flex-1 text-center m-10">{error()}</div>
                ) : loading() ? (
                    <div class="flex-1 text-center m-10">Carregando...</div>
                ) : (
                    <>
                        <WorksheetPreview
                            currentPath={currentPath()}
                            item={worksheetStore}
                            onClickPeace={(key) => setCurrentPath(key)}
                            onAdd={handleAddPeace}
                            onRemove={handleRemovePeace}
                            onMove={handleMovePeace}
                            onUpdate={handleUpdatePeace}
                        />
                    </>
                )}
            </div>
            <SaveContainer
                worksheet={worksheetStore}
                handleSetWorksheet={setWorksheetStore}
                handleSetLastTempSaved={setLastTempSaved}
            />
            <Drawer variant="persistent" open={drawerOpen()} anchor="left">
                <div style={{ width: '500px' }} class="bg-gray-700 h-full flex flex-col basis-auto">
                    <Stack alignItems="flex-end" p={2}>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <FiArrowLeft />
                        </IconButton>
                    </Stack>
                    <Form
                        worksheet={worksheetStore}
                        handleSetWorksheet={setWorksheetStore}
                        currentPath={currentPath()}
                        handleSetPath={setCurrentPath}
                    />
                </div>
            </Drawer>
        </div>
    )
}

export default CreateNewDay
