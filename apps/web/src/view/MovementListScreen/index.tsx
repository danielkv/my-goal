import { IMovement } from 'goal-models'
import { RESULT_TYPES } from 'goal-utils'
import { debounce } from 'radash'
import { FiPlus, FiVideo } from 'solid-icons/fi'

import { Component, For, Show, createEffect, createMemo, createResource, createSignal } from 'solid-js'

import DashboardContainer from '@components/DashboardContainer'
import Pagination from '@components/Pagination'
import TextInput from '@components/TextInput'
import { Delete, Edit } from '@suid/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@suid/material'
import { IGetMovements, getMovementsUseCase } from '@useCases/movements/getMovements'
import { removeMovementUseCase } from '@useCases/movements/removeMovement'
import { getErrorMessage } from '@utils/errors'
import { redirectToLogin } from '@utils/redirectToLogin'

import DialogForm from './DialogForm'

const MovementListScreen: Component = () => {
    redirectToLogin()

    const [editingMovement, setEditingMovement] = createSignal<IMovement | null>(null)
    const [dialogOpen, setDialogOpen] = createSignal(false)
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

    const buttonsDisabled = createMemo(() => !!loadinRemoveAction())

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setEditingMovement(null)
    }

    const [listResult, { refetch }] = createResource(
        () => ({ page: currentPage(), pageSize: 20, search: currentSearch() } as IGetMovements),
        getMovementsUseCase
    )

    const handleOpenUpdateMovement = async (movement: IMovement) => {
        setDialogOpen(true)
        setEditingMovement(movement)
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
                                    <TableCell>Vídeo</TableCell>
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
                                                {movement.video ? (
                                                    <IconButton
                                                        onClick={() => movement.video && window.open(movement.video)}
                                                    >
                                                        <FiVideo />
                                                    </IconButton>
                                                ) : (
                                                    '-'
                                                )}{' '}
                                            </TableCell>

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
                <DialogForm
                    open={dialogOpen()}
                    onClose={handleCloseDialog}
                    editing={editingMovement()}
                    onSuccess={() => refetch()}
                />
            </Container>
        </DashboardContainer>
    )
}

export default MovementListScreen
