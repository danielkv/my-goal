import { IMovement, IMovementInput, TResultType } from 'goal-models'
import { RESULT_TYPES } from 'goal-utils'
import { debounce } from 'radash'
import { FiPlus } from 'solid-icons/fi'

import { Component, For, Show, createEffect, createMemo, createResource, createSignal } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import DashboardContainer from '@components/DashboardContainer'
import Pagination from '@components/Pagination'
import TextInput from '@components/TextInput'
import { Delete, Edit } from '@suid/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@suid/material'
import { addMovementUseCase } from '@useCases/movements/addMovement'
import { IGetMovements, getMovementsUseCase } from '@useCases/movements/getMovements'
import { removeMovementUseCase } from '@useCases/movements/removeMovement'
import { updateMovementUseCase } from '@useCases/movements/updateMovement'
import { getErrorMessage } from '@utils/errors'
import { redirectToLogin } from '@utils/redirectToLogin'

const MovementListScreen: Component = () => {
    redirectToLogin()

    const [movementNameValue, setMovementNameValue] = createSignal('')
    const [movementResultTypeValue, setMovementResultTypeValue] = createSignal<TResultType | ''>('')
    const [editingMovement, setEditingMovement] = createSignal<IMovement | null>(null)
    const [dialogOpen, setDialogOpen] = createSignal(false)
    const [loadinAction, setLoadingAction] = createSignal(false)
    const [loadinRemoveAction, setLoadingRemoveAction] = createSignal<string | null>(null)

    const [currentPage, setCurrentPage] = createSignal(0)
    const [searchInput, setSearchInput] = createSignal('')
    const [currentSearch, setCurrentSearch] = createSignal('')
    const debouncedEffect = debounce({ delay: 400 }, (input: string) => {
        setCurrentSearch(input)
    })

    createEffect(() => {
        debouncedEffect(searchInput())
    })

    const buttonsDisabled = createMemo(() => !!loadinRemoveAction() || loadinAction())

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setEditingMovement(null)
        setMovementNameValue('')
        setMovementResultTypeValue('')
    }

    const [listResult, { refetch }] = createResource(
        () => ({ page: currentPage(), pageSize: 20, search: currentSearch() } as IGetMovements),
        getMovementsUseCase
    )

    const handleUpdateMovement = async () => {
        try {
            const movement = editingMovement()
            if (!movement) throw new Error('Nenhum movimento selecionado para edição')

            const resultType = movementResultTypeValue()
            if (!resultType) throw new Error('Tipo de resultado não permitido')

            const newMovementData = { ...movement, resultType, movement: movementNameValue() }

            setLoadingRemoveAction(movement.id)
            await updateMovementUseCase(movement.id, newMovementData)
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoadingRemoveAction(null)
        }
    }

    const handleAddMovement = async () => {
        const resultType = movementResultTypeValue()
        if (!resultType) throw new Error('Tipo de resultado não permitido')

        const movement: IMovementInput = {
            movement: movementNameValue(),
            resultType,
        }

        await addMovementUseCase(movement)
    }

    const handleFinishModal = async () => {
        try {
            setLoadingAction(true)

            if (editingMovement()) await handleUpdateMovement()
            else await handleAddMovement()

            await refetch()

            handleCloseDialog()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoadingAction(false)
        }
    }

    const handleOpenUpdateMovement = async (movement: IMovement) => {
        setDialogOpen(true)
        setEditingMovement(movement)
        setMovementNameValue(movement.movement)
        setMovementResultTypeValue(movement.resultType)
    }

    const handleRemoveMovement = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este movimento?'))
            try {
                setLoadingRemoveAction(id)

                await removeMovementUseCase(id)

                await refetch()
            } catch (err) {
                alert(getErrorMessage(err))
            } finally {
                setLoadingRemoveAction(null)
            }
    }

    const handleOpenAddMovement = async () => {
        setDialogOpen(true)
    }

    const handleNextPage = () => {
        const nextPage = listResult()?.nextPage || 0
        if (!nextPage) return
        setCurrentPage(nextPage)
    }

    const handlePrevPage = () => {
        const prevPage = currentPage() - 1
        if (prevPage < 0) return
        setCurrentPage(prevPage)
    }

    createEffect(() => {
        if (dialogOpen()) document.getElementById('movementName')?.focus()
    })

    return (
        <DashboardContainer>
            <Container maxWidth="lg">
                <Box mt={6} pb={10}>
                    <Stack mb={8} direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h1" fontSize={28} fontWeight="bold">
                            Movimentos{' '}
                            <Show when={listResult.loading}>
                                <CircularProgress size={20} color="warning" />
                            </Show>
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<FiPlus />}
                            onClick={handleOpenAddMovement}
                        >
                            Adicionar movimento
                        </Button>
                    </Stack>
                    <Box mb={6}>
                        <Stack>
                            <TextInput
                                class="max-w-md"
                                label="Busca"
                                name="Busca"
                                value={searchInput()}
                                onInput={(e) => {
                                    setSearchInput((e.target as HTMLInputElement).value)
                                }}
                            />
                        </Stack>
                    </Box>

                    <Show when={listResult()?.items.length}>
                        <Pagination onClickNext={handleNextPage} onClickPrev={handlePrevPage} />
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Tipo de resultado</TableCell>
                                    <TableCell>Resultados</TableCell>
                                    <TableCell class="w-[160px]">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <For each={listResult()?.items}>
                                    {(movement) => (
                                        <TableRow>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Box fontWeight="bold">{movement.movement}</Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>{RESULT_TYPES[movement.resultType]}</TableCell>
                                            <TableCell>{movement.countResults}</TableCell>

                                            <TableCell>
                                                <Show when={loadinRemoveAction() === movement.id}>
                                                    <CircularProgress size={20} color="warning" />
                                                </Show>

                                                <IconButton
                                                    title="Editar movimento"
                                                    onClick={() => handleOpenUpdateMovement(movement)}
                                                    disabled={buttonsDisabled()}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    title="Excluir movimento"
                                                    onClick={() => handleRemoveMovement(movement.id)}
                                                    disabled={buttonsDisabled()}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </For>
                            </TableBody>
                        </Table>
                        <Pagination onClickNext={handleNextPage} onClickPrev={handlePrevPage} />
                    </Show>
                </Box>
                <Dialog
                    open={dialogOpen()}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Editar movimento</DialogTitle>
                    <DialogContent class="w-96 max-w-[100%]">
                        <Stack gap={2}>
                            <TextInput
                                label="Movimento"
                                name="movementName"
                                value={movementNameValue()}
                                onChange={(e) => setMovementNameValue((e.target as HTMLInputElement).value)}
                            />
                            <select
                                class="input input-full"
                                onChange={(e) => setMovementResultTypeValue(e.target.value as TResultType)}
                            >
                                <option>Selecione</option>
                                <For each={Object.entries(RESULT_TYPES)}>
                                    {([key, label]) => (
                                        <option value={key} selected={movementResultTypeValue() === key}>
                                            {label}
                                        </option>
                                    )}
                                </For>
                            </select>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCloseDialog}
                            disabled={loadinAction()}
                        >
                            Cancelar
                        </Button>
                        <Button variant="contained" onClick={handleFinishModal} disabled={loadinAction()}>
                            {loadinAction() ? <ActivityIndicator color="#fff" size={24} /> : 'Salvar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </DashboardContainer>
    )
}

export default MovementListScreen
