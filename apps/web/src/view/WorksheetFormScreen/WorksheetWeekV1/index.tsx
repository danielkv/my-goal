import { IWorksheetInput } from 'goal-models'
import { isWorksheetModel } from 'goal-utils'
import { FiArrowLeft, FiArrowRight, FiEye } from 'solid-icons/fi'

import { Component, createSignal } from 'solid-js'
import { SetStoreFunction, StoreSetter, createStore, produce } from 'solid-js/store'

import WorksheetPreview from '@components/WorksheetPreview'
import { Path } from '@interfaces/app'
import { Box, Drawer, IconButton, Stack, Toolbar } from '@suid/material'
import {
    findNextIndexPath,
    findPreviousIndexPath,
    getLastIndex,
    getPeaceFromPath,
    pathToParent,
    setPeaceFromPath,
} from '@utils/paths'
import { redirectToLogin } from '@utils/redirectToLogin'

import { IWorksheetFormBaseProps } from '../types'

import Form from './components/Form'
import SaveContainer from './components/SaveContainer'

interface WorksheetWeekV1Props extends IWorksheetFormBaseProps {
    initialData: IWorksheetInput<'v1'>
}

const WorksheetWeekV1: Component<WorksheetWeekV1Props> = (props) => {
    redirectToLogin()

    const [drawerOpen, setDrawerOpen] = createSignal(false)

    const [currentPath, setCurrentPath] = createSignal<Path>('' as Path)

    const [worksheetStore, doSetWorksheetStore] = createStore<IWorksheetInput>(props.initialData)

    //@ts-expect-error
    const setWorksheetStore: SetStoreFunction<IWorksheetInput> = (storeFn: StoreSetter<IWorksheetInput, []>) => {
        doSetWorksheetStore(storeFn)

        if (isWorksheetModel(worksheetStore)) props.saveDraft(worksheetStore)
    }

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

    return (
        <>
            <div
                style={{
                    height: 'calc(100% - 80px)',
                }}
            >
                <div class="flex flex-1 flex-col basis-auto overflow-auto relative">
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

                    <div class="pb-20">
                        <WorksheetPreview
                            currentPath={currentPath()}
                            item={worksheetStore}
                            onClickPeace={(key) => setCurrentPath(key)}
                            onAdd={handleAddPeace}
                            onRemove={handleRemovePeace}
                            onMove={handleMovePeace}
                            onUpdate={handleUpdatePeace}
                        />
                    </div>
                </div>
                <SaveContainer
                    worksheet={worksheetStore}
                    handleSetWorksheet={setWorksheetStore}
                    saveDraft={props.saveDraft}
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
        </>
    )
}

export default WorksheetWeekV1
